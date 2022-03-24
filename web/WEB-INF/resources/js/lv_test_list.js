
//변수
//Object 이기 때문에 반복 가능한 형태가 아니지만, 숫자를 값으로 받아 반복분 내에서 반복 가능 설정하여 일괄처리를 위해 만들었음.
//oject -> array -> entry를 가진 Arrays로 변환하지 않더라도 사용 가능 하기 때문에
let tdNamePairsEng = {"0":"seq", "1":"subject", "2":"lt_1", "3":"lt_2", "4":"lt_3"};
let tdNamePairsKor = {"0":"일련번호", "1":"제목", "2":"항목1", "3":"항목2", "4":"항목3"};
let tdLength = Object.keys(tdNamePairsEng).length;


//코드상 DOM이 로드 되기전에 dom 객체 조작하면 body가 없음.
window.addEventListener('DOMContentLoaded', function(){
    let title1 = document.createElement("h3")
    title1.innerHTML = "Result"
    title1.classList.add("result_h3");
    document.querySelector("body").append(title1);

    let title2 = document.createElement("h3")
    title2.innerHTML = "문서수정"
    title2.classList.add("edit_h3");
    document.querySelector(".result_h3").after(title2);
})


let mkTable = function (data){
    let result = data.result;
    let table = document.createElement("table");
    table.id = "test_table"
    document.querySelector(".result_h3").after(table);
    let tbody = document.createElement("tbody");
    document.querySelector("#test_table").appendChild(tbody);

    for (let i = 0; i < result.length; i++){
        let tableKeyContainer = document.createElement("tr");
        tableKeyContainer.classList.add(i+"_key_cont_rows")

        let tableValueContainer = document.createElement("tr");
        tableValueContainer.classList.add(i+"_value_cont_rows")

        tbody.append(tableKeyContainer);
        tbody.append(tableValueContainer);

        for(let j = 0; j < tdLength; j++){
            let tableKey = document.createElement("td");
            tableKey.innerHTML = tdNamePairsKor[j]
            tableKeyContainer.append(tableKey);
        }

        for(let j = 0; j < tdLength; j++){
            let tableValue = document.createElement("td");
            tableValue.innerHTML = result[i][j];
            tableValueContainer.append(tableValue);
        }
    }

}

function ajaxGet(){
    $.ajax({
        type: 'GET',
        url: 'http://noriapp.iptime.org/lv_test/ajax/lv_test_list.php',
        dataType: "json",
        success: function(data){
            mkTable(data);
        },
        error: function (error){
            console.log("Error: " + error);
        }
    });
}

ajaxGet();

