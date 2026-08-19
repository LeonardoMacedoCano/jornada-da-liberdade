-- Remove suporte a múltiplos idiomas: o app passa a ser pt-BR/R$ único.
ALTER TABLE "User" DROP COLUMN "language";
