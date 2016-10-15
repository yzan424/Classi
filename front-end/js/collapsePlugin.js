/* JQuery List Collapse Plugin
 * Version 1.0
 * http://www.davidjrush.com/jqueryplugin/listcollapse/
 *
 * Copyright 2012, David J Rush
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function(a){a.fn.collapseList=function(f){var e=a.extend({collapseNum:1,moreLinkText:"view more",lessLinkText:"view less"},f);return this.each(function(){var b=a(this),c=parseInt(b.css("marginTop").replace("px",""))+parseInt(b.css("paddingTop").replace("px",""));b.children("li:lt("+e.collapseNum+")").each(function(){c+=a(this).outerHeight(!0)});if(0<c){b.wrap('<div class="collapseWrapper" />');var d=b.parent();d.after('<a href="#" class="collapseMore">'+e.moreLinkText+"</a>");d.css({height:c}); d.next("a.collapseMore").click(function(){a(this).hasClass("expanded")?(d.animate({height:c},500),a(this).text(e.moreLinkText).removeClass("expanded")):(d.animate({height:b.outerHeight(!0)},500),a(this).text(e.lessLinkText).addClass("expanded"));return!1})}})}})(jQuery);