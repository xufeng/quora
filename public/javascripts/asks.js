var Asks = {
  mute : function(el,id){
    App.loading();
    $.get("/asks/"+id+"/mute",{}, function(res){
        App.loading(false);
        if(!App.requireUser(res,"text")){
          return false;
        }
        // $(el).replaceWith('<span class="muted">不再显示</span>');
				$(el).parent().parent().fadeOut("fast");
    });
    return false;
  },

	unmute : function(el,id){
    App.loading();
    $.get("/asks/"+id+"/unmute",{}, function(res){
        App.loading(false);
        if(!App.requireUser(res,"text")){
          return false;
        }
        // $(el).replaceWith('<span class="muted">不再显示</span>');
				$(el).parent().parent().fadeOut("fast");
    });
    return false;
  },

	follow : function(el,id){
    App.loading();
    $.get("/asks/"+id+"/follow",{}, function(res){
        App.loading(false);
        if(!App.requireUser(res,"text")){
          return false;
        }
        $(el).replaceWith('<span class="muted">已关注</span>');
				// $(el).parent().parent().fadeOut("slow");
    });
    return false;
  },

	unfollow : function(el,id){
    App.loading();
    $.get("/asks/"+id+"/unfollow",{}, function(res){
        App.loading(false);
        if(!App.requireUser(res,"text")){
          return false;
        }
        // $(el).replaceWith('<a href="/asks'+id+'/follow">关注</a>');
				$(el).parent().parent().fadeOut("fast");
    });
    return false;
  },

  version : function(){
  }

}

/* 添加问题 */
function addAsk(){      
  var txtTitle = $("#hidden_new_ask textarea:nth-of-type(1)");
  ask_search_text = $("#add_ask input").val();
  txtTitle.text(ask_search_text);
  $.facebox({ div : "#hidden_new_ask", overlay : false });
  txtTitle.focus();
  return false;
}

var searchCache = new jCaches(40,false);
var lastSearchText = null;
var searchTimer = null;
function showSearchComplete(el,type){
  clearTimeout(searchTimer);
  html = "";
  if(type == "click" && $(el).val() == ""){
    html = $(el).attr("placeholder");
    searchCallback(el,html);
  }
  else{
    searchTimer = setTimeout(function(){
      t = $(el).val().trim();
      if(t == lastSearchText){
        return false;
      }
      lastSearchText = t;
      cachedItems = searchCache.get(t);
      if(cachedItems == null){
        $.ajax({
          url : "/search.json",
          data : { w : t },
          dataType : "json",
          success : function(res){
            searchCache.add(t,res);
            searchAjaxCallback(el,res);
          }
        });
      }
      else{
        searchAjaxCallback(el,cachedItems);
      }
    },200);
  }

  return false;
}

function searchAjaxCallback(el,res){
  html = '<ul class="complete">';
  App.loading(false);            
  if(res.length > 0){
    for(var i=0;i<res.length;i++){
      html += '<li onclick="location.href = $(\'a\',this).attr(\'href\');">';
      if(res[i].topics.length > 0){
        html += '<span class="cate">'+res[i].topics[0]+'</span>';
      }
      item_title = res[i].title;
      html += '<a href="/asks/'+res[i]._id+'">'+item_title+'</a>';
      html += '</li>';
    }
    html += '<li class="more" onclick="location.href=\'/search?w='+t+'\';">关于“'+t+'”更多搜索结果...</li>';
  }
  else{
    html += '<li>没有找到关于“'+t+'”的结果: <a href="#" onclick="return addAsk();">添加这个问题</a></li>';
  }
  html += "</ul>";
  searchCallback(el,html);
}

function searchCallback(el, html){
  el_width = $(el).width();
  $(el).jDialog({
    content : html,
    width : el_width + 250,
    title_visiable : false,
    top_offset : 1,
    left_offset : -1
  });
}
