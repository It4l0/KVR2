import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Sistema } from '../models/Sistema';
import { UsuarioSistema } from '../models/UsuarioSistema';

function escapeSqlValue(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (val instanceof Date) return `'${val.toISOString().replace('T', ' ').replace('Z', '')}'`;
  const s = String(val).replace(/'/g, "''");
  return `'${s}'`;
}

function toCSVRow(fields: (string | number | boolean | null | Date)[]): string {
  return fields
    .map((v) => {
      if (v === null || v === undefined) return '';
      const s = v instanceof Date ? v.toISOString() : String(v);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    })
    .join(',');
}

export const exportBackup = async (req: Request, res: Response) => {
  try {
    const format = String(req.query.format || 'sql').toLowerCase();
    const includeParam = String(req.query.include || '').trim();
    const include = includeParam
      ? includeParam.split(',').map((s) => s.trim()).filter(Boolean)
      : ['usuarios', 'sistemas', 'vinculos'];

    const userRepo = AppDataSource.getRepository(User);
    const sistemaRepo = AppDataSource.getRepository(Sistema);
    const vincRepo = AppDataSource.getRepository(UsuarioSistema);

    const [users, sistemas, vinculos] = await Promise.all([
      include.includes('usuarios') ? userRepo.find() : Promise.resolve([]),
      include.includes('sistemas') ? sistemaRepo.find() : Promise.resolve([]),
      include.includes('vinculos') ? vincRepo.find({ relations: ['usuario', 'sistema'] }) : Promise.resolve([]),
    ]);

    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');

    if (format === 'sql') {
      let sql = '';
      if (users.length) {
        users.forEach((u) => {
          sql += `INSERT INTO "user" (id,nome_completo,email,senha,empresa,telefone,setor,cargo,data_nascimento,data_cadastro,status) VALUES (${escapeSqlValue(u.id)},${escapeSqlValue(u.nome_completo)},${escapeSqlValue(u.email)},${escapeSqlValue(u.senha)},${escapeSqlValue(u.empresa)},${escapeSqlValue(u.telefone)},${escapeSqlValue(u.setor)},${escapeSqlValue(u.cargo)},${escapeSqlValue(u.data_nascimento)},${escapeSqlValue(u.data_cadastro)},${escapeSqlValue(u.status)});\n`;
        });
        sql += '\n';
      }
      if (sistemas.length) {
        sistemas.forEach((s) => {
          sql += `INSERT INTO "sistema" (id,nome,descricao,data_cadastro) VALUES (${escapeSqlValue(s.id)},${escapeSqlValue(s.nome)},${escapeSqlValue((s as any).descricao ?? null)},${escapeSqlValue((s as any).data_cadastro ?? null)});\n`;
        });
        sql += '\n';
      }
      if (vinculos.length) {
        vinculos.forEach((v) => {
          sql += `INSERT INTO "usuario_sistema" (id,usuarioId,sistemaId,perfil,data_cadastro) VALUES (${escapeSqlValue(v.id)},${escapeSqlValue(v.usuario?.id)},${escapeSqlValue(v.sistema?.id)},${escapeSqlValue(v.perfil)},${escapeSqlValue(v.data_cadastro)});\n`;
        });
        sql += '\n';
      }

      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', `attachment; filename="backup-${stamp}.sql"`);
      return res.send(sql);
    }

    if (format === 'excel' || format === 'csv') {
      const header = ['table','id','data'];
      const rows: string[] = [];
      rows.push(toCSVRow(header));
      users.forEach((u) => rows.push(toCSVRow(['usuarios', u.id, JSON.stringify(u)])));
      sistemas.forEach((s) => rows.push(toCSVRow(['sistemas', s.id, JSON.stringify(s)])));
      vinculos.forEach((v) => rows.push(toCSVRow(['vinculos', v.id, JSON.stringify({
        id: v.id,
        usuarioId: v.usuario?.id,
        sistemaId: v.sistema?.id,
        perfil: v.perfil,
        data_cadastro: v.data_cadastro,
      })])));

      const csv = rows.join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="backup-${stamp}.csv"`);
      return res.send('\uFEFF' + csv);
    }

    if (format === 'pdf') {
      // Stream a simple, structured PDF summary of the selected datasets
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="backup-${stamp}.pdf"`);
      doc.pipe(res);

      // Title
      doc.fontSize(18).text('Backup do Sistema', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#666').text(`Gerado em: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.fillColor('#000');
      doc.moveDown();

      const drawSection = (title: string) => {
        doc.moveDown(0.5);
        doc.fontSize(14).text(title, { underline: true });
        doc.moveDown(0.25);
      };

      // Usuarios
      if (users.length) {
        drawSection(`Usuários (${users.length})`);
        doc.fontSize(10);
        users.forEach((u) => {
          doc.text(`ID: ${u.id} | Nome: ${u.nome_completo} | Email: ${u.email}`);
        });
      }

      // Sistemas
      if (sistemas.length) {
        drawSection(`Sistemas (${sistemas.length})`);
        doc.fontSize(10);
        sistemas.forEach((s) => {
          const nome = (s as any).nome ?? '';
          const descricao = (s as any).descricao ?? '';
          doc.text(`ID: ${s.id} | Nome: ${nome} | Descrição: ${descricao}`);
        });
      }

      // Vínculos
      if (vinculos.length) {
        drawSection(`Vínculos Usuário-Sistema (${vinculos.length})`);
        doc.fontSize(10);
        vinculos.forEach((v) => {
          doc.text(`ID: ${v.id} | UsuarioID: ${v.usuario?.id} | SistemaID: ${v.sistema?.id} | Perfil: ${v.perfil}`);
        });
      }

      if (!users.length && !sistemas.length && !vinculos.length) {
        doc.text('Nenhum dado incluído no backup para este PDF.');
      }

      doc.end();
      return;
    }

    return res.status(400).json({ message: 'Formato inválido. Use sql, excel (csv) ou pdf.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao gerar backup' });
  }
};
