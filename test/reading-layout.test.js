import test from 'node:test';
import assert from 'node:assert/strict';
import { readingLayout } from '../src/_lib/reading-layout.js';
test('chapter links retain author anchors and avoid collisions without rewriting prose', () => {
 const input='<div id="chapter-work"></div><h2>Work</h2><h2>Work</h2><h2 id="sam">Sam &amp; Brea</h2>';
 const result=readingLayout(input);
 assert.deepEqual(result.chapters.map(c=>c.id),['chapter-work-2','chapter-work-3','sam']);
 assert.equal(result.chapters[2].title,'Sam & Brea');
 assert.equal(result.html.replace(/ id="chapter-work-[23]"/g,''),input);
});
test('literal headings are ignored and single chapters do not add redundant navigation',()=>{
 const input='<!-- <h2>Hidden</h2> --><textarea><h2>Literal</h2></textarea><h2>Visible</h2>';
 const result=readingLayout(input);
 assert.deepEqual(result.chapters,[]);
 assert.equal(result.html,input.replace('<h2>Visible','<h2 id="chapter-visible">Visible'));
});

// The shared footer is visually within the reading surface, but is site-wide.
test('global footer retains its contentinfo landmark independently of main nesting', async () => {
 const {readFile}=await import('node:fs/promises');
 const {parser}=await import('posthtml-parser');
 const source=await readFile(new URL('../src/_includes/layouts/base.njk',import.meta.url),'utf8');
 const flatten=nodes=>nodes.flatMap(n=>typeof n==='object'?[n,...flatten(n.content??[])]:[]);
 const nodes=flatten(parser(source));
 const landmarks=nodes.filter(n=>n.attrs?.role==='contentinfo');
 assert.equal(landmarks.length,1);
 assert.equal(landmarks[0].tag,'footer');
 assert.ok(landmarks[0].attrs.class.split(/\s+/).includes('site-footer'));
});
