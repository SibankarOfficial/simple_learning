import { Fragment } from 'react';
import { Code, LoadState, Missing } from './components.jsx';
import { href } from './content.js';
import useContent from './useContent.js';

function inline(text) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function isTableDivider(line) {
  return /^\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line);
}

function cells(line) {
  return line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
}

function MarkdownNotes({ markdown }) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++]);
      index += 1;
      blocks.push({ type: 'code', language, code: code.join('\n') });
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }
    if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const header = cells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(cells(lines[index++]));
      blocks.push({ type: 'table', header, rows });
      continue;
    }
    if (/^-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^-\s+/.test(lines[index])) items.push(lines[index++].replace(/^-\s+/, ''));
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) items.push(lines[index++].replace(/^\d+\.\s+/, ''));
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }
    const paragraph = [line.trimEnd()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !lines[index].startsWith('```') && !/^(#{1,4})\s+/.test(lines[index]) && !/^---+$/.test(lines[index].trim()) && !/^-\s+/.test(lines[index]) && !/^\d+\.\s+/.test(lines[index]) && !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))) paragraph.push(lines[index++].trimEnd());
    blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
  }

  return <div className="lesson-body dsa-notes-body">{blocks.map((block, blockIndex) => {
    if (block.type === 'heading') {
      const Heading = block.level === 1 ? 'h2' : block.level === 2 ? 'h3' : block.level === 3 ? 'h4' : 'h5';
      return <Heading key={blockIndex}>{inline(block.text)}</Heading>;
    }
    if (block.type === 'rule') return <hr key={blockIndex} />;
    if (block.type === 'code') return <Code key={blockIndex} language={block.language}>{block.code}</Code>;
    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul';
      return <List key={blockIndex}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</List>;
    }
    if (block.type === 'table') return <div className="table-scroll" key={blockIndex}><table><thead><tr>{block.header.map((cell, cellIndex) => <th key={cellIndex}>{inline(cell)}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
    return <p className={block.text.includes('\n') ? 'notes-lines' : undefined} key={blockIndex}>{block.text.split('\n').map((part, partIndex) => <Fragment key={partIndex}>{inline(part)}{partIndex < block.text.split('\n').length - 1 && <br />}</Fragment>)}</p>;
  })}</div>;
}

function validateChapter(data) {
  if (!data?.id || !data.title || !data.noteTitle || typeof data.content !== 'string' || data.content.length < 1000) throw new Error('The DSA notes chapter is incomplete.');
  return data;
}

export default function DsaNotes({ id }) {
  const resource = useContent(`content/dsa/chapters/${id}.json`, validateChapter);
  if (resource.error?.message === 'This content file is missing.') return <Missing />;
  if (!resource.data) return <LoadState resource={resource} />;
  return <>
    <a className="back-link" href={href('dsa')}>← DSA</a>
    <header className="page-heading"><p className="eyebrow">DSA NOTES</p><h1>{resource.data.title}</h1><p>{resource.data.noteTitle}</p></header>
    <p className="draft-note">These notes were supplied by the learner. Only small factual and C++ correctness fixes were made.</p>
    <MarkdownNotes markdown={resource.data.content} />
  </>;
}
