import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const BADGE_THRESHOLDS = {
  first_steps: 5,
  champion: 25,
  leader: 50,
  ambassador: 100,
  lifetime: 250,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all hours for this user
    const allHours = await base44.entities.VolunteerHours.filter({
      user_email: user.email,
    });

    const totalHours = allHours.reduce((sum, h) => sum + (h.hours || 0), 0);

    // Get existing badges
    const existingBadges = await base44.entities.VolunteerBadge.filter({
      user_email: user.email,
    });

    const existingBadgeTypes = existingBadges.map(b => b.badge_type);

    // Award badges based on hours
    const badgesToAward = [];
    for (const [badgeType, threshold] of Object.entries(BADGE_THRESHOLDS)) {
      if (totalHours >= threshold && !existingBadgeTypes.includes(badgeType)) {
        badgesToAward.push({
          user_email: user.email,
          badge_type: badgeType,
          hours_earned_at: totalHours,
          earned_date: new Date().toISOString().split('T')[0],
        });
      }
    }

    // Create new badges
    if (badgesToAward.length > 0) {
      await base44.entities.VolunteerBadge.bulkCreate(badgesToAward);
    }

    return Response.json({
      success: true,
      totalHours,
      badgesAwarded: badgesToAward.length,
      newBadges: badgesToAward,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});