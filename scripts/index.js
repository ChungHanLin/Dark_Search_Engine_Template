$(window).ready(function() {
    // Search bar event handler
    var search_bar = document.getElementById('search_bar');
    search_bar.onkeypress = getKeyword;

});


 function getKeyword(event) {
    if (event.keyCode == 13) {
        $("#content_block").empty();
        request_es(search_bar.value);
    }
 }

function request_es(search_str) {
    var request_url = "http://localhost:8000/search.php";
    var request_data = {search : search_str};
    
    $.ajax({
        type : "GET",
        url : request_url,
        data : request_data,
        success : function (response) {
            var json = JSON.parse(response);
            var content_block = document.getElementById("content_block");
            var card;
            for (i = 0; i < json["article"].length; i++) {
                card = create_card(json["article"][i], search_str);
                content_block.append(card);
            }
        },
        error: function (err_msg) {
            alert('Server Error');
        }
    });
}

function create_card(data, search_str) {
    console.log(data);
    var card = document.createElement("div");
    card.className = "card";
    
    var card_body = document.createElement("div");
    card_body.className = "card-body";
    
    var title = document.createElement("p");
    title.className = "title";
    
    var highlight_block = highlight_title(data["title"], search_str);
    
    title.append(highlight_block);
    
    var url = document.createElement("p");
    url.className = "url";
    url.innerText = data["url"];
    
    var maintext = document.createElement("p");
    maintext.className = "maintext";
    highlight_block = highlight_keyword(data["maintext"], search_str);
    
    maintext.append(highlight_block);
    
    card_body.append(title);
    card_body.append(url);
    card_body.append(maintext);
    
    card.append(card_body);
    
    card.onclick = function () {
        document.location.href = data["url"];
    };
    
    return card;
}

function highlight_title(text, key) {
    var normal, cur_index, prev_index, highlight;
    var title = document.createElement("div");
    prev_index = 0;
    while ((cur_index = text.indexOf(key, prev_index)) != -1) {
        normal = document.createElement("span");
        normal.innerText = text.substr(prev_index, cur_index - prev_index);
        
        highlight = document.createElement("span");
        highlight.innerText = key;
        highlight.style.fontWeight = "bold";
        highlight.style.color = "#e74c3c";
        
        title.append(normal);
        title.append(highlight);
        
        prev_index = cur_index + key.length;
    }
    
    if ((text.length - prev_index) > 0) {
        normal = document.createElement("span");
        normal.innerText = text.substr(prev_index, text.length - prev_index);
        title.append(normal);
    }
    
    return title;
}

function highlight_keyword(text, key) {
    var normal, cur_index, prev_index, highlight, rest_num;
    var article = document.createElement("div");
    
    cur_index = text.indexOf(key);
    rest_num = 50;
    
    if (cur_index < 20) {
        prev_index = 0;
        normal = document.createElement("span");
        normal.innerText = text.substr(prev_index, cur_index - prev_index);
        
        highlight = document.createElement("span");
        highlight.innerText = key;
        highlight.style.fontWeight = "bold";
        highlight.style.color = "#e74c3c";
        
        article.append(normal);
        article.append(highlight);
        
        prev_index = cur_index + key.length;
        rest_num -= prev_index;
    }
    else if (cur_index == -1) {
        normal = document.createElement("span");
        normal.innerText = text.substr(0, 50);
        article.append(normal);
        return article;
    }
    else {
        prev_index = cur_index + key.length;
        normal = document.createElement("span");
        normal.innerText = "...";
        
        highlight = document.createElement("span");
        highlight.innerText = key;
        highlight.style.fontWeight = "bold";
        highlight.style.color = "#e74c3c";
        
        article.append(normal);
        article.append(highlight);
        
        rest_num -= (cur_index + key.length - prev_index);
        prev_index = cur_index + key.length;
    }
    
    
    while ((cur_index = text.indexOf(key, prev_index)) != -1 && rest_num > 0) {
        normal = document.createElement("span");
        normal.innerText = text.substr(prev_index, cur_index - prev_index);
        
        highlight = document.createElement("span");
        highlight.innerText = key;
        highlight.style.fontWeight = "bold";
        highlight.style.color = "#e74c3c";
        
        article.append(normal);
        article.append(highlight);
        
        rest_num -= (cur_index + key.length - prev_index);
        prev_index = cur_index + key.length;
    }
    
    normal = document.createElement("span");
    normal.innerText = "...";
    article.append(normal);
    
    return article;
}