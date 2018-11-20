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
