#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
从《吕祖灵签》.txt 解析并生成 constants/luzuLingqian.ts。

说明：
- 严格按 TXT 内容输出，不再使用旧的 fortune/category 字段。
- 兼容个别签缺少“解曰：”标记的情况（默认前两行签文，其余为解曰）。
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
SOURCE_TXT = ROOT / '《吕祖灵签》.txt'
OUTPUT_TS = Path(__file__).resolve().parent / 'luzuLingqian.ts'

CN_NUM = {'零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9}
UNIT = {'十': 10, '百': 100, '佰': 100, '千': 1000}

HEADER_RE = re.compile(r'^(第?[一二三四五六七八九十百佰0-9]+签)[\.．。:]?(.+)?$')


def cn_to_int(text: str) -> int:
    if text.isdigit():
        return int(text)
    # 兼容“七四”这类两位简写
    if all(ch in CN_NUM for ch in text) and len(text) == 2:
        return CN_NUM[text[0]] * 10 + CN_NUM[text[1]]
    total = 0
    num = 0
    for ch in text:
        if ch in CN_NUM:
            num = CN_NUM[ch]
        elif ch in UNIT:
            if num == 0:
                num = 1
            total += num * UNIT[ch]
            num = 0
    return total + num


def is_header(line: str) -> bool:
    s = line.strip()
    if not s or '-' in s:
        return False
    return bool(HEADER_RE.match(s))


def parse_txt() -> dict:
    if not SOURCE_TXT.exists():
        raise FileNotFoundError(f'找不到源文件: {SOURCE_TXT}')

    lines = [l.rstrip('\n') for l in SOURCE_TXT.read_text(encoding='utf-8').splitlines()]

    # 头部信息
    intro_lines = []
    lingqian_title = None
    guide_title = None
    guide_items = []
    prayer = None
    explain_title = None

    for line in lines:
        s = line.strip()
        if is_header(line):
            break
        if not s:
            continue
        if re.fullmatch(r'\d+\s*-\s*\d+签', s):
            continue
        if s == '吕祖灵签':
            lingqian_title = s
            continue
        if s == '求签需知：':
            guide_title = s
            continue
        if re.match(r'^\d+、', s):
            guide_items.append(s)
            continue
        if s.startswith('默念：'):
            prayer = s
            continue
        if s == '签文解释：':
            explain_title = s
            continue
        intro_lines.append(s)

    # 分段标题（如 1-20签）
    section_titles = []
    for line in lines:
        s = line.strip()
        if re.fullmatch(r'\d+\s*-\s*\d+签', s) and s not in section_titles:
            section_titles.append(s)

    # 签文区块
    header_indices = [i for i, line in enumerate(lines) if is_header(line)]
    entries = []

    for idx, start in enumerate(header_indices):
        end = header_indices[idx + 1] if idx + 1 < len(header_indices) else len(lines)
        block = [l.rstrip() for l in lines[start:end]]
        header_line = block[0].strip()

        m = HEADER_RE.match(header_line)
        if not m:
            raise ValueError(f'无法解析标题: {header_line}')

        num_token = m.group(1)
        num_str = num_token[1:] if num_token.startswith('第') else num_token
        num_str = num_str.replace('签', '')
        number = cn_to_int(num_str)

        qian_idx = next((i for i, l in enumerate(block) if l.strip().startswith('签文')), None)
        if qian_idx is None:
            raise ValueError(f'缺少“签文”： {header_line}')

        jie_idx = next((i for i, l in enumerate(block) if l.strip().startswith('解曰')), None)

        if jie_idx is None:
            # 兼容缺少“解曰：”的签：默认前两行签文，其余为解曰
            lines_after = [l.strip() for l in block[qian_idx + 1:] if l.strip()]
            qian_lines = lines_after[:2]
            jie_lines = lines_after[2:]
        else:
            qian_lines = [l.strip() for l in block[qian_idx + 1:jie_idx] if l.strip()]
            jie_lines = [l.strip() for l in block[jie_idx + 1:] if l.strip()]

        entries.append({
            'number': number,
            'title': header_line,
            'qianwen': qian_lines,
            'jieyue': jie_lines,
        })

    if len(entries) != 100:
        raise ValueError(f'签数异常: {len(entries)}（应为100）')

    return {
        'title': lingqian_title or '吕祖灵签',
        'intro': intro_lines,
        'guide_title': guide_title or '求签需知：',
        'guide_items': guide_items,
        'prayer': prayer or '',
        'explain_title': explain_title or '签文解释：',
        'section_titles': section_titles,
        'entries': entries,
    }


def build_ts(data: dict) -> str:
    out = []
    out.append('/**')
    out.append(' * 吕祖灵签 - 100签完整数据（来源：《吕祖灵签》.txt）')
    out.append(' */')
    out.append('')
    out.append('export interface LuZuLingqian {')
    out.append('  number: number;')
    out.append('  title: string;')
    out.append('  qianwen: string[];')
    out.append('  jieyue: string[];')
    out.append('}')
    out.append('')
    out.append("export type ShengbeiResult = 'shengbei' | 'xiaobei' | 'yangbei' | 'yinbei';")
    out.append('')
    out.append('export interface ShengbeiConfig {')
    out.append('  type: ShengbeiResult;')
    out.append('  name: string;')
    out.append('  description: string;')
    out.append('  meaning: string;')
    out.append('  allowDraw: boolean;')
    out.append('}')
    out.append('')
    out.append('export const SHENGBEI_CONFIGS: Record<ShengbeiResult, ShengbeiConfig> = {')
    out.append("  shengbei: { type: 'shengbei', name: '圣杯', description: '一正一反', meaning: '神明同意，可以抽签', allowDraw: true },")
    out.append("  xiaobei: { type: 'xiaobei', name: '笑杯', description: '两面皆正', meaning: '神明笑问，说明不明，请重新掷杯', allowDraw: false },")
    out.append("  yangbei: { type: 'yangbei', name: '阳杯', description: '两面皆反', meaning: '神明否定，时机未到，请重新掷杯', allowDraw: false },")
    out.append("  yinbei: { type: 'yinbei', name: '阴杯', description: '落地不稳', meaning: '神明不悦，心诚则灵，请重新掷杯', allowDraw: false }")
    out.append('};')
    out.append('')
    out.append('export const TRADITIONAL_NUMBERS: Record<number, string> = {')
    out.append("  1: '壹', 2: '贰', 3: '叁', 4: '肆', 5: '伍',")
    out.append("  6: '陆', 7: '柒', 8: '捌', 9: '玖', 10: '拾',")
    out.append("  11: '拾壹', 12: '拾贰', 13: '拾叁', 14: '拾肆', 15: '拾伍',")
    out.append("  16: '拾陆', 17: '拾柒', 18: '拾捌', 19: '拾玖', 20: '贰拾',")
    out.append("  21: '贰拾壹', 22: '贰拾贰', 23: '贰拾叁', 24: '贰拾肆', 25: '贰拾伍',")
    out.append("  26: '贰拾陆', 27: '贰拾柒', 28: '贰拾捌', 29: '贰拾玖', 30: '叁拾',")
    out.append("  31: '叁拾壹', 32: '叁拾贰', 33: '叁拾叁', 34: '叁拾肆', 35: '叁拾伍',")
    out.append("  36: '叁拾陆', 37: '叁拾柒', 38: '叁拾捌', 39: '叁拾玖', 40: '肆拾',")
    out.append("  41: '肆拾壹', 42: '肆拾贰', 43: '肆拾叁', 44: '肆拾肆', 45: '肆拾伍',")
    out.append("  46: '肆拾陆', 47: '肆拾柒', 48: '肆拾捌', 49: '肆拾玖', 50: '伍拾',")
    out.append("  51: '伍拾壹', 52: '伍拾贰', 53: '伍拾叁', 54: '伍拾肆', 55: '伍拾伍',")
    out.append("  56: '伍拾陆', 57: '伍拾柒', 58: '伍拾捌', 59: '伍拾玖', 60: '陆拾',")
    out.append("  61: '陆拾壹', 62: '陆拾贰', 63: '陆拾叁', 64: '陆拾肆', 65: '陆拾伍',")
    out.append("  66: '陆拾陆', 67: '陆拾柒', 68: '陆拾捌', 69: '陆拾玖', 70: '柒拾',")
    out.append("  71: '柒拾壹', 72: '柒拾贰', 73: '柒拾叁', 74: '柒拾肆', 75: '柒拾伍',")
    out.append("  76: '柒拾陆', 77: '柒拾柒', 78: '柒拾捌', 79: '柒拾玖', 80: '捌拾',")
    out.append("  81: '捌拾壹', 82: '捌拾贰', 83: '捌拾叁', 84: '捌拾肆', 85: '捌拾伍',")
    out.append("  86: '捌拾陆', 87: '捌拾柒', 88: '捌拾捌', 89: '捌拾玖', 90: '玖拾',")
    out.append("  91: '玖拾壹', 92: '玖拾贰', 93: '玖拾叁', 94: '玖拾肆', 95: '玖拾伍',")
    out.append("  96: '玖拾陆', 97: '玖拾柒', 98: '玖拾捌', 99: '玖拾玖', 100: '壹佰'")
    out.append('};')
    out.append('')

    out.append(f"export const LUZU_LINGQIAN_TITLE = {data['title']!r};")
    out.append('export const LUZU_LINGQIAN_INTRO: string[] = [')
    for line in data['intro']:
        out.append(f'  {line!r},')
    out.append('];')
    out.append('')

    out.append(f"export const LUZU_LINGQIAN_GUIDE_TITLE = {data['guide_title']!r};")
    out.append('export const LUZU_LINGQIAN_GUIDE: string[] = [')
    for item in data['guide_items']:
        out.append(f'  {item!r},')
    out.append('];')
    out.append('')

    out.append(f"export const LUZU_LINGQIAN_PRAYER = {data['prayer']!r};")
    out.append('')
    out.append(f"export const LUZU_LINGQIAN_EXPLAIN_TITLE = {data['explain_title']!r};")
    out.append('export const LUZU_LINGQIAN_SECTION_TITLES: string[] = [')
    for s in data['section_titles']:
        out.append(f'  {s!r},')
    out.append('];')
    out.append('')

    out.append('export const LUZU_LINGQIAN: LuZuLingqian[] = [')
    for entry in data['entries']:
        out.append('  {')
        out.append(f"    number: {entry['number']},")
        out.append(f"    title: {entry['title']!r},")
        out.append('    qianwen: [')
        for line in entry['qianwen']:
            out.append(f'      {line!r},')
        out.append('    ],')
        out.append('    jieyue: [')
        for line in entry['jieyue']:
            out.append(f'      {line!r},')
        out.append('    ]')
        out.append('  },')
    out.append('];')
    out.append('')

    out.append('export const getLingqianByNumber = (number: number): LuZuLingqian | undefined => {')
    out.append('  return LUZU_LINGQIAN.find(qian => qian.number === number);')
    out.append('};')
    out.append('')
    out.append('export const getTraditionalNumber = (number: number): string => {')
    out.append('  return TRADITIONAL_NUMBERS[number] || number.toString();')
    out.append('};')
    out.append('')
    out.append('export const drawLingqian = (): LuZuLingqian => {')
    out.append('  const randomIndex = Math.floor(Math.random() * LUZU_LINGQIAN.length);')
    out.append('  return LUZU_LINGQIAN[randomIndex];')
    out.append('};')
    out.append('')
    out.append('export const throwShengbei = (): ShengbeiResult => {')
    out.append('  const random = Math.random();')
    out.append('  if (random < 0.6) return "shengbei";')
    out.append('  if (random < 0.8) return "xiaobei";')
    out.append('  if (random < 0.95) return "yangbei";')
    out.append('  return "yinbei";')
    out.append('};')
    out.append('')
    out.append('export const SHENGBEI_ANIMATION_FRAMES = [')
    out.append('  "shengbei", "xiaobei", "yangbei", "yinbei",')
    out.append('  "shengbei", "xiaobei", "yangbei", "yinbei",')
    out.append('  "shengbei", "shengbei", "xiaobei", "shengbei"')
    out.append('];')
    out.append('')

    return '\n'.join(out) + '\n'


def main() -> None:
    data = parse_txt()
    OUTPUT_TS.write_text(build_ts(data), encoding='utf-8')
    print(f'written {len(data["entries"])} -> {OUTPUT_TS}')


if __name__ == '__main__':
    main()
