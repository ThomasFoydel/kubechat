-- CreateEnum
CREATE TYPE "ConversationVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ConversationMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "visibility" "ConversationVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "ConversationMember" ADD COLUMN     "role" "ConversationMemberRole" NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE INDEX "ConversationMember_conversationId_role_idx" ON "ConversationMember"("conversationId", "role");
