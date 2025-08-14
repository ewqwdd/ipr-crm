-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('SOFT', 'HARD');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'IN_REVIEW', 'TO_DO');

-- CreateEnum
CREATE TYPE "MaterialContentType" AS ENUM ('VIDEO', 'ARTICLE', 'BOOK', 'COURSE', 'TASK');

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

-- CreateEnum
CREATE TYPE "Rate360Type" AS ENUM ('Rate360', 'Rate180');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RATE_ASSIGNED_SELF', 'RATE_ASSIGNED', 'RATE_CONFIRM', 'TASK_ASSIGNED', 'IPR_ASSIGNED', 'TEST_ASSIGNED', 'TEST_TIME_OVER', 'SURVEY_ASSIGNED', 'SUPPORT_TICKET_CREATED');

-- CreateEnum
CREATE TYPE "TestAccess" AS ENUM ('PUBLIC', 'PRIVATE', 'LINK_ONLY');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SINGLE', 'MULTIPLE', 'NUMBER', 'TEXT');

-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('SINGLE', 'MULTIPLE', 'NUMBER', 'TEXT', 'SCALE', 'DATE', 'FILE', 'PHONE', 'TIME');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

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
CREATE TABLE "UserDeputy" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deputyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDeputy_pkey" PRIMARY KEY ("id")
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
    "teamId" INTEGER,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "type" "SkillType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "curatorComment" TEXT,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "rateType" "Rate360Type" NOT NULL DEFAULT 'Rate360',
    "userComment" TEXT,
    "showReportToUser" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "active" BOOLEAN NOT NULL DEFAULT true,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Assigned_Test" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "availableFrom" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "firstNotificationSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_Assigned_Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Assigned_Survey" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "availableFrom" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "firstNotificationSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_Assigned_Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnsweredQuestion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER,
    "surveyQuestionId" INTEGER,
    "assignedTestId" INTEGER,
    "assignedSurveyId" INTEGER,
    "correct" BOOLEAN,
    "textAnswer" TEXT,
    "numberAnswer" INTEGER,
    "scaleAnswer" INTEGER,
    "dateAnswer" TIMESTAMP(3),
    "fileAnswer" TEXT,
    "phoneAnswer" TEXT,
    "timeAnswer" TEXT,

    CONSTRAINT "UserAnsweredQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnsweredQuestionOption" (
    "id" SERIAL NOT NULL,
    "userAnsweredQuestionId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "correct" BOOLEAN,

    CONSTRAINT "UserAnsweredQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "finishMessage" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "access" "TestAccess" NOT NULL DEFAULT 'PRIVATE',
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestion" (
    "id" SERIAL NOT NULL,
    "type" "SurveyType" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "surveyId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "maxLength" INTEGER,
    "maxNumber" INTEGER,
    "minNumber" INTEGER,
    "allowDecimal" BOOLEAN NOT NULL DEFAULT false,
    "scaleDots" INTEGER,
    "scaleStart" TEXT,
    "scaleEnd" TEXT,
    "photoUrl" TEXT,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "failedMessage" TEXT,
    "finishMessage" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT true,
    "limitedByTime" BOOLEAN NOT NULL DEFAULT false,
    "minimumScore" INTEGER,
    "passedMessage" TEXT,
    "showScoreToUser" BOOLEAN NOT NULL DEFAULT false,
    "timeLimit" INTEGER,
    "access" "TestAccess" NOT NULL DEFAULT 'PRIVATE',
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "testId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "allowDecimal" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT NOT NULL,
    "maxLength" INTEGER,
    "maxNumber" INTEGER,
    "minNumber" INTEGER,
    "numberCorrectValue" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "score" INTEGER,
    "textCorrectValue" TEXT,
    "type" "QuestionType" NOT NULL,
    "photoUrl" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER,
    "value" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "surveyQuestionId" INTEGER,

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
CREATE TABLE "GrowthPlanCurator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "GrowthPlanCurator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthPlanTask" (
    "id" SERIAL NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL,
    "priority" "TaskPriority" DEFAULT 'MEDIUM',
    "type" "TaskMaterialType" NOT NULL,
    "onBoard" BOOLEAN NOT NULL DEFAULT false,
    "planId" INTEGER NOT NULL,
    "indicatorId" INTEGER,
    "materialId" INTEGER NOT NULL,
    "competencyId" INTEGER,

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
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "version" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skillType" "SkillType" NOT NULL,
    "rate360Id" INTEGER,

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
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "assignedSurveyId" INTEGER,
    "assignedTestId" INTEGER,
    "iprId" INTEGER,
    "rateId" INTEGER,
    "type" "NotificationType" NOT NULL,

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
CREATE TABLE "CuratorSpecs" (
    "specId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "CuratorSpecs_pkey" PRIMARY KEY ("specId","teamId")
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
    "archived" BOOLEAN DEFAULT false,
    "archivedDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CompetencyBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "blockId" INTEGER NOT NULL,
    "archived" BOOLEAN DEFAULT false,
    "archivedDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "competencyId" INTEGER NOT NULL,
    "archived" BOOLEAN DEFAULT false,
    "archivedDate" TIMESTAMP(3),
    "boundary" INTEGER NOT NULL DEFAULT 3,
    "hint1" TEXT,
    "hint2" TEXT,
    "hint3" TEXT,
    "hint4" TEXT,
    "hint5" TEXT,
    "value1" TEXT,
    "value2" TEXT,
    "value3" TEXT,
    "value4" TEXT,
    "value5" TEXT,
    "skipHint" TEXT,
    "skipValue" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

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

-- CreateTable
CREATE TABLE "ProfileVersion" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "curatorId" INTEGER,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileConstructorFolderProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileConstructorFolderProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileConstructorFolderTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileConstructorFolderTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileConstructorFolderSpec" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileConstructorFolderSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetencyBlockToProfileConstructorFolderSpec" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompetencyBlockToProfileConstructorFolderSpec_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CompetencyBlockToRate360" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompetencyBlockToRate360_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SpecBlocks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SpecBlocks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDeputy_userId_deputyId_key" ON "UserDeputy"("userId", "deputyId");

-- CreateIndex
CREATE UNIQUE INDEX "IndividualGrowthPlan_rate360Id_key" ON "IndividualGrowthPlan"("rate360Id");

-- CreateIndex
CREATE UNIQUE INDEX "UserTeam_userId_teamId_key" ON "UserTeam"("userId", "teamId");

-- CreateIndex
CREATE INDEX "_CompetencyBlockToProfileConstructorFolderSpec_B_index" ON "_CompetencyBlockToProfileConstructorFolderSpec"("B");

-- CreateIndex
CREATE INDEX "_CompetencyBlockToRate360_B_index" ON "_CompetencyBlockToRate360"("B");

-- CreateIndex
CREATE INDEX "_SpecBlocks_B_index" ON "_SpecBlocks"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeputy" ADD CONSTRAINT "UserDeputy_deputyId_fkey" FOREIGN KEY ("deputyId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeputy" ADD CONSTRAINT "UserDeputy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComments" ADD CONSTRAINT "UserComments_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComments" ADD CONSTRAINT "UserComments_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComments" ADD CONSTRAINT "UserComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_Course" ADD CONSTRAINT "Assigned_Course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigned_Course" ADD CONSTRAINT "Assigned_Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Assigned_Test" ADD CONSTRAINT "User_Assigned_Test_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Assigned_Test" ADD CONSTRAINT "User_Assigned_Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Assigned_Survey" ADD CONSTRAINT "User_Assigned_Survey_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Assigned_Survey" ADD CONSTRAINT "User_Assigned_Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestion" ADD CONSTRAINT "UserAnsweredQuestion_assignedSurveyId_fkey" FOREIGN KEY ("assignedSurveyId") REFERENCES "User_Assigned_Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestion" ADD CONSTRAINT "UserAnsweredQuestion_assignedTestId_fkey" FOREIGN KEY ("assignedTestId") REFERENCES "User_Assigned_Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestion" ADD CONSTRAINT "UserAnsweredQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestion" ADD CONSTRAINT "UserAnsweredQuestion_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestion" ADD CONSTRAINT "UserAnsweredQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestionOption" ADD CONSTRAINT "UserAnsweredQuestionOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnsweredQuestionOption" ADD CONSTRAINT "UserAnsweredQuestionOption_userAnsweredQuestionId_fkey" FOREIGN KEY ("userAnsweredQuestionId") REFERENCES "UserAnsweredQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "SurveyQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360Evaluator" ADD CONSTRAINT "Rate360Evaluator_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate360Evaluator" ADD CONSTRAINT "Rate360Evaluator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanCurator" ADD CONSTRAINT "GrowthPlanCurator_planId_fkey" FOREIGN KEY ("planId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanCurator" ADD CONSTRAINT "GrowthPlanCurator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanTask" ADD CONSTRAINT "GrowthPlanTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualGrowthPlan" ADD CONSTRAINT "IndividualGrowthPlan_rate360Id_fkey" FOREIGN KEY ("rate360Id") REFERENCES "Rate360"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualGrowthPlan" ADD CONSTRAINT "IndividualGrowthPlan_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualGrowthPlan" ADD CONSTRAINT "IndividualGrowthPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanLog" ADD CONSTRAINT "GrowthPlanLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthPlanLog" ADD CONSTRAINT "GrowthPlanLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_assignedSurveyId_fkey" FOREIGN KEY ("assignedSurveyId") REFERENCES "User_Assigned_Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_assignedTestId_fkey" FOREIGN KEY ("assignedTestId") REFERENCES "User_Assigned_Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_iprId_fkey" FOREIGN KEY ("iprId") REFERENCES "IndividualGrowthPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_parentTeamId_fkey" FOREIGN KEY ("parentTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuratorSpecs" ADD CONSTRAINT "CuratorSpecs_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuratorSpecs" ADD CONSTRAINT "CuratorSpecs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecsOnUserTeam" ADD CONSTRAINT "SpecsOnUserTeam_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecsOnUserTeam" ADD CONSTRAINT "SpecsOnUserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecsOnUserTeam" ADD CONSTRAINT "SpecsOnUserTeam_userId_teamId_fkey" FOREIGN KEY ("userId", "teamId") REFERENCES "UserTeam"("userId", "teamId") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileConstructorFolderTeam" ADD CONSTRAINT "ProfileConstructorFolderTeam_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProfileConstructorFolderProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileConstructorFolderSpec" ADD CONSTRAINT "ProfileConstructorFolderSpec_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "ProfileConstructorFolderTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyBlockToProfileConstructorFolderSpec" ADD CONSTRAINT "_CompetencyBlockToProfileConstructorFolderSpec_A_fkey" FOREIGN KEY ("A") REFERENCES "CompetencyBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyBlockToProfileConstructorFolderSpec" ADD CONSTRAINT "_CompetencyBlockToProfileConstructorFolderSpec_B_fkey" FOREIGN KEY ("B") REFERENCES "ProfileConstructorFolderSpec"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyBlockToRate360" ADD CONSTRAINT "_CompetencyBlockToRate360_A_fkey" FOREIGN KEY ("A") REFERENCES "CompetencyBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetencyBlockToRate360" ADD CONSTRAINT "_CompetencyBlockToRate360_B_fkey" FOREIGN KEY ("B") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecBlocks" ADD CONSTRAINT "_SpecBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "CompetencyBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecBlocks" ADD CONSTRAINT "_SpecBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
