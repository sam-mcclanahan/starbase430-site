import assert from 'node:assert/strict';
import test from 'node:test';
import {polargraphFeedFallback} from '../src/_lib/polargraph-feed.js';
test('feed replaces only the polargraph frame with a static image',()=>{
 const figure='<figure><iframe src="/assets/drafts/pablo/polargraph.html" title="Drawing" loading="lazy"></iframe><figcaption>Illustrative dimensions. <a href="/assets/drafts/pablo/polargraph.svg">SVG</a></figcaption></figure>';
 const result=polargraphFeedFallback(figure);
 assert.ok(!result.includes('<iframe'));
 assert.match(result, /<img src="\/assets\/drafts\/pablo\/pablo.png"/);
 assert.ok(result.includes(figure.slice(figure.indexOf('<figcaption>'))));
 assert.equal(polargraphFeedFallback('<p>Unrelated entry.</p>'),'<p>Unrelated entry.</p>');
});
