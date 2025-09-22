import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

   @Get(':workspaceId')
  async getAnalytics(
    @Param('workspaceId') workspaceId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analytics.getWorkspaceAnalytics(workspaceId, startDate, endDate);
  }

//   @Get(':workspaceId/campaigns-per-day')
//   async campaignsPerDay(
//     @Param('workspaceId') workspaceId: string,
//     @Query('days') days = '7'
//   ) {
//     const daysNum = Math.max(1, Number(days) || 7);
//     return this.analytics.getCampaignsPerDay(workspaceId, daysNum);
//   }

//   @Get(':workspaceId/messages-by-type')
//   async messagesByType(@Param('workspaceId') workspaceId: string) {
//     return this.analytics.getMessagesByType(workspaceId);
//   }

//   @Get(':workspaceId/contacts-reached')
//   async contactsReached(@Param('workspaceId') workspaceId: string) {
//     return this.analytics.getContactsReached(workspaceId);
//   }

//   @Get(':workspaceId/recent-campaigns')
//   async recentCampaigns(
//     @Param('workspaceId') workspaceId: string,
//     @Query('limit') limit = '5'
//   ) {
//     const limitNum = Math.max(1, Number(limit) || 5);
//     return this.analytics.getRecentCampaigns(workspaceId, limitNum);
//   }

//   @Get(':workspaceId/top-tags')
//   async topTags(
//     @Param('workspaceId') workspaceId: string,
//     @Query('limit') limit = '10'
//   ) {
//     const limitNum = Math.max(1, Number(limit) || 10);
//     return this.analytics.getTopTags(workspaceId, limitNum);
//   }


}
