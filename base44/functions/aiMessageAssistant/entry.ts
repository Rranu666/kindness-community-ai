import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, messageContent, targetPerson, incomingMessage, teamMembers, userMessage } = body;

    let prompt = '';
    let jsonSchema = null;

    if (action === 'chat' || (!action && userMessage)) {
      const msg = userMessage || messageContent || '';
      prompt = `You are the Kindness Synergy Hub AI Assistant — a knowledgeable, warm, and highly capable assistant for the Kindness Community Foundation (KCF) team workspace.

About KCF:
- Kindness Community Foundation is a California-based nonprofit building ethical, technology-assisted volunteer networks, transparent governance, and sustainable community infrastructure.
- Founded by Fred A. Behr.
- Key initiatives: FreeAppMaker.ai (website-to-APK converter), MyMind Studio (digital product studio), ServiceConnectPro.ai (service marketplace), KCF Foundation (biblical guidance & emotional support), CryptoTradeSignals.ai (crypto signals), KarmaTrust (community empowerment hub).
- Mission: Enable community empowerment through ethical commerce, technology & measurable impact.
- Vision: A global ecosystem where kindness drives progress.

Workspace features you can guide users on:
- Social Wall: Post updates, like and comment on others' posts
- Messages: Group chat with the full team  
- Direct Messages: Private 1-on-1 conversations
- Tasks: Create, assign, and track tasks
- Documents: Upload and share files
- Announcements: Important team-wide updates
- Team Directory: Browse team members and profiles
- AI Assistant: That's you!

You can:
- Answer ANY question knowledgeably (general knowledge, productivity, KCF topics, coding help, writing, etc.)
- Draft messages, announcements, social posts, emails
- Give strategic advice about nonprofit operations, community building, and digital platforms
- Help plan, brainstorm, and ideate
- Explain workspace features

Current user: ${user.full_name} (${user.email}, role: ${user.role || 'team_member'})

User's message: "${msg}"

Respond in a warm, professional, and helpful tone. Be thorough when needed but concise when appropriate. Always be genuinely helpful.`;

    } else if (action === 'draft') {
      prompt = `You are a professional message assistant for the Synergy Hub team workspace. The user wants to send a message to ${targetPerson || 'the team'}.

Intent: ${messageContent}

Generate a professional, clear, and concise message that conveys this intent. The message should be appropriate for a team environment.
Return a single well-crafted message ready to send.`;

    } else if (action === 'suggest_reply') {
      prompt = `You are a helpful message assistant. Someone sent this message:

"${incomingMessage}"

Suggest a thoughtful, professional reply that:
1. Acknowledges the sender's message
2. Provides a helpful response
3. Is concise and appropriate for a team environment

Return a single suggested reply message.`;

    } else if (action === 'route') {
      const memberNames = (teamMembers || []).map(m => `- ${m.full_name} (${m.department || 'General'})`).join('\n');
      prompt = `You are a message routing assistant. Based on this message content, determine which team member(s) should receive it.

Message: "${messageContent}"

Available team members:
${memberNames}

Analyze the message and suggest who it should go to and why.`;
      jsonSchema = {
        type: 'object',
        properties: {
          suggested_recipients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                reason: { type: 'string' }
              }
            }
          },
          summary: { type: 'string' }
        }
      };
    } else {
      // Fallback: treat any unknown action as a general chat
      prompt = `You are Synergy Hub AI — a helpful assistant for a nonprofit team workspace. The user sent: "${messageContent || userMessage || JSON.stringify(body)}". Respond helpfully and concisely.`;
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: jsonSchema
    });

    return Response.json({
      success: true,
      data: response,
      action: action || 'chat'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});