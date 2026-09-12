// The supplied instruction uses headings, paragraphs, bold text and an ordered list.
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const inline=text=>escape(text).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
export function instructionHTML(markdown){
  const lines=markdown.trim().split('\n'),out=[];let paragraph=[],item=[],ordered=false;
  const flushParagraph=()=>{if(paragraph.length){out.push(`<p>${inline(paragraph.join(' '))}</p>`);paragraph=[];}};
  const flushItem=()=>{if(item.length){out.push(`<li>${inline(item.join(' '))}</li>`);item=[];}};
  const endList=()=>{if(ordered){flushItem();out.push('</ol>');ordered=false;}};
  for(const line of lines){
    const heading=line.match(/^(#{1,2}) (.+)$/),step=line.match(/^\d+\. (.*)$/);
    if(heading){flushParagraph();endList();const level=heading[1].length+1;out.push(`<h${level}>${inline(heading[2])}</h${level}>`);}
    else if(step){flushParagraph();if(!ordered){out.push('<ol>');ordered=true;}flushItem();item.push(step[1]);}
    else if(!line.trim()){flushParagraph();endList();}
    else if(ordered)item.push(line.trim());else paragraph.push(line.trim());
  }
  flushParagraph();endList();return out.join('\n');
}
