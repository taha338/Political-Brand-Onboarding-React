/**
 * GET /api/clickup-prefill?clientId=<id>  — Form 2 (Political Brand Discovery)
 *
 * Pre-fills from Active Clients master only. Form 2 typically runs FIRST
 * in the onboarding flow, so cross-form lookup (Form 1, Form 3) isn't useful.
 *
 * Returns:
 *   {
 *     found: bool,
 *     taskId, taskName, taskUrl,
 *     clientId, tradeName,
 *     subjectType,        // 'candidate' | 'party' | null
 *     contact: { name, email, phone, secondaryName, secondaryEmail, secondaryRole },
 *     meta:    { communicationPreference, packageSelected, industry }
 *   }
 *
 * Required env vars:
 *   - CLICKUP_API_TOKEN
 * Optional:
 *   - CLICKUP_ACTIVE_CLIENTS_LIST_ID  (default 901113554047)
 */

const FIELDS = {
  clientId:       'Client ID',
  tradeName:      'DBA / Trade Name*',
  primaryName:    'Primary Contact Name*',
  primaryEmail:   'Primary Contact Email*',
  primaryPhone:   'Primary Contact Phone*',
  secondaryName:  'Secondary Contact Name',
  secondaryEmail: 'Secondary Contact Email',
  secondaryRole:  'Secondary Contact Role',
  commPref:       'Communication Preference*',
  packageSel:     'Package Selected**',
  industry:       'Industry / Niche',
  subjectType:    'Subject Type',
};

function findFieldValue(customFields, label) {
  if (!Array.isArray(customFields) || !label) return null;
  const m = customFields.find((f) => f?.name?.toLowerCase().trim() === label.toLowerCase().trim());
  if (!m) return null;
  if (m.type === 'drop_down' && m.value !== undefined && m.value !== null) {
    const opt = m.type_config?.options?.[m.value];
    return opt?.name ?? null;
  }
  return m.value ?? null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { clientId } = req.query;
  if (!clientId || typeof clientId !== 'string') {
    return res.status(400).json({ error: 'clientId query parameter is required' });
  }
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(clientId)) {
    return res.status(400).json({ error: 'Invalid clientId format' });
  }

  const token  = process.env.CLICKUP_API_TOKEN;
  const listId = process.env.CLICKUP_ACTIVE_CLIENTS_LIST_ID || '901113554047';
  if (!token) return res.status(500).json({ error: 'CLICKUP_API_TOKEN not configured' });

  try {
    const url = `https://api.clickup.com/api/v2/list/${encodeURIComponent(listId)}/task?include_closed=true&subtasks=false`;
    const upstream = await fetch(url, {
      method: 'GET',
      headers: { Authorization: token, Accept: 'application/json' },
    });
    if (!upstream.ok) {
      const body = await upstream.text();
      return res.status(upstream.status).json({ error: 'ClickUp API failed', detail: body.slice(0, 500) });
    }
    const data = await upstream.json();
    const match = (data.tasks || []).find((t) =>
      (t.custom_fields || []).some(
        (cf) => cf.name?.toLowerCase().trim() === FIELDS.clientId.toLowerCase().trim()
          && String(cf.value || '').toLowerCase() === clientId.toLowerCase()
      )
    );
    if (!match) return res.status(200).json({ found: false });

    const cfs = match.custom_fields || [];
    const subjectType = findFieldValue(cfs, FIELDS.subjectType);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      found: true,
      taskId:   match.id,
      taskName: match.name,
      taskUrl:  match.url,
      clientId:  findFieldValue(cfs, FIELDS.clientId),
      tradeName: findFieldValue(cfs, FIELDS.tradeName),
      subjectType: typeof subjectType === 'string' ? subjectType.toLowerCase() : null,
      contact: {
        name:           findFieldValue(cfs, FIELDS.primaryName),
        email:          findFieldValue(cfs, FIELDS.primaryEmail),
        phone:          findFieldValue(cfs, FIELDS.primaryPhone),
        secondaryName:  findFieldValue(cfs, FIELDS.secondaryName),
        secondaryEmail: findFieldValue(cfs, FIELDS.secondaryEmail),
        secondaryRole:  findFieldValue(cfs, FIELDS.secondaryRole),
      },
      meta: {
        communicationPreference: findFieldValue(cfs, FIELDS.commPref),
        packageSelected:         findFieldValue(cfs, FIELDS.packageSel),
        industry:                findFieldValue(cfs, FIELDS.industry),
      },
    });
  } catch (err) {
    return res.status(502).json({ error: 'Upstream fetch failed', detail: String(err?.message || err) });
  }
}
