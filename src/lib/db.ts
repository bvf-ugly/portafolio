import fs from 'fs/promises';
import path from 'path';
import sql from 'mssql';

const fallbackFile = path.resolve('data/config.json');

const defaultConfig = {
  theme: 'dark',
  background: 'aurora',
  backgroundUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1400&q=80',
  calendar: { showEvents: true, showHolidays: true },
  timer: { focusMinutes: 25, breakMinutes: 5, customMinutes: 15 }
};

// Configuración de SQL Server
function getSqlConfig(): sql.config | string {
  if (process.env.SQLSERVER_CONNECTION_STRING) {
    return process.env.SQLSERVER_CONNECTION_STRING;
  }

  return {
    server: process.env.SQLSERVER_HOST || 'localhost',
    authentication: {
      type: (process.env.SQLSERVER_AUTH as any) || 'default', // 'default' para usuario/contraseña, 'ntlm' para Windows
      options: {
        userName: process.env.SQLSERVER_USER || '',
        password: process.env.SQLSERVER_PASSWORD || '',
        domain: process.env.SQLSERVER_DOMAIN || undefined
      }
    },
    options: {
      database: process.env.SQLSERVER_DB || 'PortafolioConfig',
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      instanceName: process.env.SQLSERVER_INSTANCE || 'SQLEXPRESS'
    }
  };
}

// Asegura que exista el directorio para el archivo de respaldo
async function ensureDirectory() {
  const dir = path.dirname(fallbackFile);
  await fs.mkdir(dir, { recursive: true });
}

// Lectura de configuración desde archivo JSON
async function readFallbackConfig() {
  try {
    await ensureDirectory();
    const content = await fs.readFile(fallbackFile, 'utf8');
    return JSON.parse(content);
  } catch {
    await fs.writeFile(fallbackFile, JSON.stringify(defaultConfig, null, 2), 'utf8');
    return defaultConfig;
  }
}

// Escritura de configuración en archivo JSON
async function writeFallbackConfig(config: unknown) {
  await ensureDirectory();
  await fs.writeFile(fallbackFile, JSON.stringify(config, null, 2), 'utf8');
  return config;
}

// Asegura que exista la tabla en SQL Server
async function ensureSqlTable(pool: sql.ConnectionPool) {
  await pool.request().query(`
    IF OBJECT_ID(N'dbo.AppConfig', N'U') IS NULL
    CREATE TABLE dbo.AppConfig (
      Id INT IDENTITY(1,1) PRIMARY KEY,
      Config NVARCHAR(MAX) NOT NULL,
      UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
  `);
}

// Obtiene configuración desde SQL Server
async function getSqlConfigValue() {
  try {
    const pool = await sql.connect(getSqlConfig());
    await ensureSqlTable(pool);
    const result = await pool.request().query('SELECT TOP 1 Config FROM dbo.AppConfig ORDER BY Id DESC');
    if (result.recordset.length === 0) throw new Error('No config found');
    return JSON.parse(result.recordset[0].Config);
  } catch (error) {
    console.error('Error leyendo configuración desde SQL Server:', error);
    return null;
  }
}

// Guarda configuración en SQL Server
async function saveSqlConfigValue(config: unknown) {
  try {
    const pool = await sql.connect(getSqlConfig());
    await ensureSqlTable(pool);
    const payload = JSON.stringify(config);
    await pool.request().input('config', sql.NVarChar(sql.MAX), payload).query(
      'INSERT INTO dbo.AppConfig (Config) VALUES (@config);'
    );
    return config;
  } catch (error) {
    console.error('Error guardando configuración en SQL Server:', error);
    return null;
  }
}

// API pública para obtener configuración
export async function getConfig() {
  const config = await getSqlConfigValue();
  if (config) return config;
  return await readFallbackConfig();
}

// API pública para guardar configuración
export async function saveConfig(config: unknown) {
  const saved = await saveSqlConfigValue(config);
  if (saved) return saved;
  return await writeFallbackConfig(config);
}
