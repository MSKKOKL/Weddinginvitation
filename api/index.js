import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Parse dynamic ID from query parameters or path
  const { id } = req.query;

  // Locate the index.html file in the deployed directory structure
  let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'index.html');
  }

  let html = '';
  try {
    html = fs.readFileSync(htmlPath, 'utf8');
  } catch (readErr) {
    console.error('Failed to read index.html:', readErr);
    return res.status(500).send('Internal Server Error');
  }

  // If there is an ID, fetch the invitation details via the Firestore REST API
  if (id) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/vaulted-trainer-2q7jp/databases/ai-studio-weddinginvitatio-7d0b6ccd-7f81-446f-bfc3-5f88e32608f8/documents/invitations/${id}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        const brideName = data.fields?.brideName?.stringValue || '';
        const groomName = data.fields?.groomName?.stringValue || '';
        const photoUrl = data.fields?.photoUrl?.stringValue || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=80';

        if (brideName && groomName) {
          const dynamicTitle = `💍 ${brideName} ❤️ ${groomName} | Wedding Invitation`;
          const dynamicDescription = "You're warmly invited to celebrate our special day. Tap to view the invitation, venue, RSVP, and event details.";
          const ogDescription = "You're warmly invited to celebrate our special day.";
          const invitationUrl = `https://wedding-invitation-undakkam.vercel.app/?id=${id}`;

          // 1. Replace the <title> tag
          html = html.replace(/<title>[^]*?<\/title>/gi, `<title>${dynamicTitle}</title>`);

          // 2. Replace the standard meta description
          html = html.replace(/<meta name="description" content="[^]*?" \/>/gi, `<meta name="description" content="${dynamicDescription}" />`);

          // 3. Replace the Facebook / Open Graph (og:) tags
          html = html.replace(/<meta property="og:url" content="[^]*?" \/>/gi, `<meta property="og:url" content="${invitationUrl}" />`);
          html = html.replace(/<meta property="og:title" content="[^]*?" \/>/gi, `<meta property="og:title" content="${dynamicTitle}" />`);
          html = html.replace(/<meta property="og:description" content="[^]*?" \/>/gi, `<meta property="og:description" content="${ogDescription}" />`);
          html = html.replace(/<meta property="og:image" content="[^]*?" \/>/gi, `<meta property="og:image" content="${photoUrl}" />`);

          // 4. Replace the Twitter Card tags
          html = html.replace(/<meta name="twitter:url" content="[^]*?" \/>/gi, `<meta name="twitter:url" content="${invitationUrl}" />`);
          html = html.replace(/<meta name="twitter:title" content="[^]*?" \/>/gi, `<meta name="twitter:title" content="${dynamicTitle}" />`);
          html = html.replace(/<meta name="twitter:description" content="[^]*?" \/>/gi, `<meta name="twitter:description" content="${ogDescription}" />`);
          html = html.replace(/<meta name="twitter:image" content="[^]*?" \/>/gi, `<meta name="twitter:image" content="${photoUrl}" />`);
        }
      } else {
        console.warn(`Firestore document fetch failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error in Dynamic Open Graph generation:', err);
    }
  }

  // Return the modified (or original) HTML response
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=31536000');
  return res.status(200).send(html);
}
