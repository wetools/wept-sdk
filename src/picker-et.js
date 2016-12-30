export default function anonymous(_, filters, escape) {
escape = escape || function escape(html){
  html = html == null ? '': html;
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
var _str="";
_str += '<div class="wx-picker">\n';
_str += '  <div class="wx-picker-hd">\n';
_str += '    <a class="wx-picker-action cancel">取消</a>\n';
_str += '    <a class="wx-picker-action confirm">确定</a>\n';
_str += '  </div>\n';
_str += '  <div class="wx-picker-bd">\n';
_.group.forEach(function(items,i){
_str += '    <div class="wx-picker-group">\n';
_str += '      <div class="wx-picker-mask2" data-index="';
_str+=escape(i);
_str += '"></div>';
_str +='\n'
_str += '      <div class="wx-picker-indicator"></div>\n';
_str += '      <div class="wx-picker-content">\n';
items.forEach(function(item,j){
_str += '        <div class="wx-picker-item" data-value="';
_str+=escape(item.value);
_str += '">';
_str +='\n'
_str += '          ';
_str+=escape(item.text);
_str +='\n'
_str += '        </div>\n';
})
_str += '      </div>\n';
_str += '    </div>\n';
})
_str += '  </div>\n';
_str += '</div>\n';
_str += '';
return _str

}
