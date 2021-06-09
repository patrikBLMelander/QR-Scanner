var wb = XLSX.utils.book_new();
wb.Props = {
    Title: "SheetJS Tutorial",
    Subject: "Test",
    Author: "Red Stapler",
    CreatedDate: new Date(2017,12,19)
};
var ws_data =[['hello','world']]

//------------Sheetname------------
wb.SheetNames.push("Test Sheet");

var ws = XLSX.utils.aoa_to_sheet(ws_data)

wb.Sheets["Test Sheet"] = ws;

var wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});

function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}




$('#create-excel-btn').click(function(){
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
});

$('#save-scans').click(function(){
    
});






