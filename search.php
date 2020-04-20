<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header("Content-Type:text/html; charset=utf-8");

// Using 'GET' method to get the search string
$search_str = isset($_GET["search"]) ? $_GET["search"] : "";

get_search_text_num($search_str, $page);

function get_search_text_num($search_str, $page){
    $search_arg = translator($search_str);
    // 計算搜尋時間
    require_once 'init.php';
    $query = $client->search([
        'body' => [
            'query' => [
                'bool' => [
                    'should' => [
                        'match' => ['title' => $search_arg],
                        'match' => ['content' => $search_arg]
                    ],
                ]
            ],
	    'min_score' => 5.0
        ]
    ]);
    
    $match_cnt = $query['hits']['total']['value'];
   
    $record_attribute = array(
        "match_count" => $match_cnt, 
    );

    if ($match_cnt == 0) {
        $json_data = array(
            "attribute" => $record_attribute
        );
    }
    else {
        $result = $query['hits']['hits'];
        for ($i = 0; $i < $match_cnt; $i++) {
            $record_article[$i] = array(
                "title" => $result[$i]['_source']['title'],
                "url" => $result[$i]['_source']['url'],
                "maintext" => $result[$i]['_source']['content']
            );
            
        }

        $json_data = array(
            "attribute" => $record_attribute,
            "article" => $record_article
        );
    }
    
    echo json_encode($json_data);
}

// 將搜尋字串轉換為可讀取模式
function translator($search_str) {
    // 去掉頭尾空白
    $search_str = trim($search_str);
    
    // 去除中間字串連續空白
    $search_str = preg_replace('/\s(?=\s)/', '', $search_str);
    return $search_str;
}
