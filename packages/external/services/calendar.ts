import CONFIG from '../config.ts'

const MONTHS: Record<string, number> = {
	'Январь': 1, 'Февраль': 2, 'Март': 3, 'Апрель': 4, 'Май': 5, 'Июнь': 6,
	'Июль': 7, 'Август': 8, 'Сентябрь': 9, 'Октябрь': 10, 'Ноябрь': 11, 'Декабрь': 12,
}

async function fetchText (url: string): Promise<string> {
	const ctrl = new AbortController()
	const t = setTimeout(() => ctrl.abort(), CONFIG.Calendar.timeoutMs)
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: { 'User-Agent': 'Mozilla/5.0' },
		})
		if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
		return await res.text()
	}
	finally { clearTimeout(t) }
}

export function parseCalendar (html: string, year: number): { year: number; holidays: string[] } {
	const holidays: string[] = []
	const tableRe = /<table class="cal">([\s\S]*?)<\/table>/g
	let tm: RegExpExecArray | null;

	while ((tm = tableRe.exec(html))) {
		const tbl = tm[1]
		const monthMatch = tbl.match(/class="month">([^<]+)</)
		if (!monthMatch) continue
		const month = MONTHS[monthMatch[1].trim()]
		if (!month) continue
		const tdRe = /<td class="([^"]*)">(\d+)<\/td>/g
		let td
		while ((td = tdRe.exec(tbl))) {
			const cls = td[1]
			const day = parseInt(td[2], 10)
			// weekend — выходной, holiday — праздник (в т.ч. перенесённый)
			if (cls.includes('weekend') || cls.includes('holiday')) {
				holidays.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
			}
		}
	}
	return { year, holidays }
}

export async function productionCalendar (year: number): Promise<{ year: number; holidays: string[] }> {
	const url = `${CONFIG.Calendar.baseUrl}${year}/`
	const html = await fetchText(url)
	return parseCalendar(html, year)
}
