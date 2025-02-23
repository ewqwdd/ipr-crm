-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('SOFT', 'HARD');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'IN_REVIEW', 'TO_DO');

-- CreateEnum
CREATE TYPE "MaterialContentType" AS ENUM ('VIDEO', 'ARTICLE', 'BOOK', 'COURSE');

-- CreateEnum
CREATE TYPE "TaskMaterialType" AS ENUM ('GENERAL', 'OBVIOUS', 'OTHER');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "Resut" AS ENUM ('PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- CreateEnum
CREATE TYPE "EvaluatorType" AS ENUM ('CURATOR', 'TEAM_MEMBER', 'SUBORDINATE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "specId" INTEGER,
    "authCode" TEXT,
    "mentorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate360" (
    "id" SERIAL NOT NULL,
    "userConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "curatorConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "specId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "type" "SkillType" NOT NULL,

    CONSTRAINT "Rate360_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserComments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rate360Id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "competencyId" INTEGER NOT NULL,

    CONSTRAINT "UserComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRates" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rate360Id" INTEGER NOT NULL,
    "indicatorId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedByUser" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserRates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assigned_Course" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Assigned_Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "externalUrl" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specId" INTEGER,
    "skillId" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spec" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Assigned_Test" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "rate360Id" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "result" "Resut",

    CONSTRAINT "User_Assigned_Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "skillId" INTEGER NOT NULL,
    "specId" INTEGER,
    "name" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "previewImage" TEXT,
    "successMessage" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "testId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate360Evaluator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rate360Id" INTEGER NOT NULL,
    "type" "EvaluatorType" NOT NULL DEFAULT 'TEAM_MEMBER',

    CONSTRAINT "Rate360Evaluator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsOnRate360" (
    "skillId" INTEGER NOT NULL,
    "rate360Id" INTEGER NOT NULL,

    CONSTRAINT "SkillsOnRate360_pkey" PRIMARY KEY ("skillId","rate360Id")
);

-- CreateTable
CREATE TABLE "GrowthPlanTask" (
    "id" SERIAL NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "type" "TaskMaterialType" NOT NULL,
    "onBoard" BOOLEAN NOT NULL DEFAULT false,
    "planId" INTEGER NOT NULL,
    "comeptencyId" INTEGER,
    "indicatorId" INTEGER,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "GrowthPlanTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndividualGrowthPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "Status" NOT NULL,
    "goal" TEXT NOT NULL,
    "result" "Resut",
    "specId" INTEGER,
    "mentorId" INTEGER,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "version" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skillType" "SkillType" NOT NULL,

    CONSTRAINT "IndividualGrowthPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthPlanLog" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "changedById" INTEGER NOT NULL,
    "changeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeType" "ChangeType" NOT NULL,
    "changes" JSONB NOT NULL,

    CONSTRAINT "GrowthPlanLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "watched" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentTeamId" INTEGER,
    "curatorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTeam" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecsOnUserTeam" (
    "specId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecsOnUserTeam_pkey" PRIMARY KEY ("specId","teamId","userId")
);

-- CreateTable
CREATE TABLE "CompetencyBlock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SkillType" NOT NULL,
    "specId" INTEGER,

    CONSTRAINT "CompetencyBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "blockId" INTEGER NOT NULL,

    CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "competencyId" INTEGER NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "level" INTEGER NOT NULL,
    "contentType" "MaterialContentType" NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyMaterial" (
    "competencyId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "CompetencyMaterial_pkey" PRIMARY KEY ("competencyId","materialId")
);

-- CreateTable
CREATE TABLE "IndicatorMaterial" (
    "indicatorId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "IndicatorMaterial_pkey" PRIMARY KEY ("indicatorId","materialId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserTeam_userId_teamId_key" ON "UserTeam"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComments" ADD CONSTRAINT "UserComments_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComments" ADD CONSTRAINT "UserComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComments" ADD CONSTRAINT "UserComments_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_Course" ADD CONSTRAINT "Assigned_Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_Course" ADD CONSTRAINT "Assigned_Course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Assigned_Test" ADD CONSTRAINT "User_Assigned_Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Assigned_Test" ADD CONSTRAINT "User_Assigned_Test_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360Evaluator" ADD CONSTRAINT "Rate360Evaluator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360Evaluator" ADD CONSTRAINT "Rate360Evaluator_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_comeptencyId_fkey" FOREIGN KEY ("comeptencyId") REFERENCES "Competency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualGrowthPlan" ADD CONSTRAINT "IndividualGrowthPlan_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualGrowthPlan" ADD CONSTRAINT "IndividualGrowthPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualGrowthPlan" ADD CONSTRAINT "IndividualGrowthPlan_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanLog" ADD CONSTRAINT "GrowthPlanLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanLog" ADD CONSTRAINT "GrowthPlanLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_parentTeamId_fkey" FOREIGN KEY ("parentTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecsOnUserTeam" ADD CONSTRAINT "SpecsOnUserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecsOnUserTeam" ADD CONSTRAINT "SpecsOnUserTeam_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecsOnUserTeam" ADD CONSTRAINT "SpecsOnUserTeam_userId_teamId_fkey" FOREIGN KEY ("userId", "teamId") REFERENCES "UserTeam"("userId", "teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyBlock" ADD CONSTRAINT "CompetencyBlock_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "CompetencyBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_planId_fkey" FOREIGN KEY ("planId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyMaterial" ADD CONSTRAINT "CompetencyMaterial_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyMaterial" ADD CONSTRAINT "CompetencyMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorMaterial" ADD CONSTRAINT "IndicatorMaterial_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorMaterial" ADD CONSTRAINT "IndicatorMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
