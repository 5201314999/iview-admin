/**
 * @project frame
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-7-3 9:08
 */
import Vue from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/darcula.css';
Vue.directive('highlight', function(el){
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    });
});