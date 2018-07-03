/**
 * @project frame
 * @author lirongtong <lirongtong@hotmail.com>
 * @github: https://github.com/wildidea
 * @date 2018-7-3 9:12
 */
import hljs from 'highlight.js';
import 'highlight.js/styles/darcula.css';
let Highlight = {};
Highlight.install = function(Vue){
    Vue.directive('highlight', {
        inserted(el) {
            let blocks = el.querySelectorAll('pre code');
            blocks.forEach((block) => {
                hljs.highlightBlock(block);
            })
        },
    })
};
export default Highlight;