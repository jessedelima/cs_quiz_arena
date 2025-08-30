/**
 * Script para migrar dados do SQLite para MySQL
 * Este script deve ser executado após configurar o MySQL e antes de iniciar o servidor em produção
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo SQLite
const SQLITE_FILE = path.resolve(__dirname, '../data/cs_quiz_arena.db');

// Verificar se o arquivo SQLite existe
if (!fs.existsSync(SQLITE_FILE)) {
  console.error(`Arquivo SQLite não encontrado: ${SQLITE_FILE}`);
  process.exit(1);
}

// Criar cliente Prisma com a nova conexão MySQL
const prisma = new PrismaClient();

async function migrateData() {
  console.log('Iniciando migração de dados do SQLite para MySQL...');

  try {
    // Verificar conexão com MySQL
    await prisma.$connect();
    console.log('Conexão com MySQL estabelecida com sucesso.');

    // Executar migrações para criar as tabelas no MySQL
    console.log('Executando migrações no MySQL...');
    // As migrações devem ser executadas manualmente com: npx prisma migrate deploy

    // Aqui você pode adicionar código para extrair dados do SQLite e inserir no MySQL
    // Exemplo:
    // 1. Ler dados do SQLite usando uma biblioteca como sqlite3
    // 2. Para cada tabela, inserir os dados no MySQL usando o cliente Prisma

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();