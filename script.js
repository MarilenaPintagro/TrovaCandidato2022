
function creaIstogrammaAnniTot(data){
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1024 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    
  // creo struttura dati anni-tot
   var anni ={};
     for (var i = 1900; i < 2020; i++){
       anni[i] = 0;
     }
      for (var i = 0; i < data.length; i++) {
        if (typeof data[i] !== 'undefined'){
        var r = data[i].dt_nasc;
        anni[r] +=1;
      }
};
  // console.log(anni);
   var anni2 =[];
     for (var i = 1900; i < 2020; i++){
       if(anni[i]!=0){
       anni2.push({"anno" : i, "tot": anni[i]});
       }
       
     }
   
   
      var svg = d3.select("a")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
   //definisco le scale
   const xScale = d3.scaleLinear().range([0, width]);
   const yScale = d3.scaleLinear().range([height, 0]);

   // xScale.domain(d3.extent(data, d => d));
   xScale.domain([d3.min(anni2, d => d.anno),d3.max(anni2, d => d.anno)])
    yScale.domain([d3.min(anni2, d => d.tot -1),d3.max(anni2, d => d.tot )]);

    //Add the rectangles (bars)
    svg.
    selectAll("bar").
    data(anni2).
    enter().
    append("rect").
    attr("x", d => {  return xScale(d.anno)}).
    attr("width", 10).
    attr("y",d=> yScale(d.tot)). // d => yScale(10)).
    attr("height", d => height - yScale(d.tot)).
    attr("class", "barre");
     
   //assi
     const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft().scale(yScale);
   svg.
    append("g").
    attr("id", "x-axis").
    attr("class", "axis").
    attr("transform", `translate(0, ${height})`).
    call(xAxis.ticks(null));
   
      svg.
    append("g").
    attr("id", "y-axis").
    attr("class", "axis").
    call(yAxis.ticks(null).tickSize(10, 10, 0));
   
   //tooltip
     var tooltip = d3.select("a").
    append("div").
    style("position", "absolute").
    style("visibility", "hidden")
    .attr("id", "tooltip");
    //
    
     svg.selectAll(".barre")
     .on("mouseover", (d,idx) => {
 // console.log(idx);
   tooltip.style("visibility", "visible")
    tooltip.html( idx.tot + " candidati nati nel " + idx.anno 
                       )
     .style("top", (event.pageY - 2)+"px")
  .style("left", (event.pageX + 2)+"px")
   .style("opacity", 0.9)

          .style("transform", "translateX(60px)");
  }).on('mouseout', (d,idx) => {
 // console.log(idx);
   tooltip.style("visibility", "hidden")});
         
         //fine tooltip
         
  
}


function resetView (data){
  d3.select("svg").remove();
  d3.select("svg").remove();
  creaIstogrammaAnniTot(data);
}



document.addEventListener('DOMContentLoaded',function(){
 (function($){
  var data;
    $.ajax({ //leggo i dati dalla fonte ondata e li converto in un json
      type: "GET",  
      url: "https://raw.githubusercontent.com/ondata/elezioni-politiche-2022/main/liste/processing/CAMERA_ITALIA_20220925_pluri.csv",
       async: false,
      dataType: "text",       
      success: function(response)  
      {
       // data = $.csv.toArrays(response);
      //  console.log(data);
        var limit = 10;
    var res = response.slice(0, 5000000000);
        var items = $.csv.toObjects(res);
        var dataJ = JSON.stringify(items);
        data = JSON.parse(dataJ);
        //console.log(Object.keys(data).length);
       
      }   
    });
   
   //setup dei filtri
   //creo lista di tutti i collegi
   var collegi = new Set();
   collegi.add("TUTTI I COLLEGI");
   //console.log(data[0])
   for (var i = 0; i < data.length; i++) {
        if (typeof data[i] !== 'undefined'){
        var r = data[i].desc_ente;
        collegi.add(r) ;
      }
   }
   
   //creo dropdown coi collegi
   d3.select("#myform")
      .append("text")
      .text("Seleziona il collegio: ");
   
   var dropDown = d3.select("#myform")
      .append("select")
      .attr("class", "selection")
      .attr("name", "collegi-list")
   .attr("id", "dropDown-collegi");
    var options = dropDown.selectAll("option")
      .data(collegi)
      .enter()
      .append("option")
    .attr("collegio", (d) =>{ return d});
    options.text(function(d) {
     // console.log(d)
        return d;
      })
      .attr("value", function(d) {
        return d.values;
      });
   
   //creo scelta multipla partiti
   //creo lista di tutti i partiti
   
   var partiti = new Set();
   partiti.add("TUTTE LE LISTE");
   //console.log(data[0])
   for (var i = 0; i < data.length; i++) {
        if (typeof data[i] !== 'undefined'){
        var r = data[i].desc_lista;
        partiti.add(r) ;
      }
   }
   //creo dropdown partiti
   d3.select("#myform")
      .append("br")
   d3.select("#myform")
      .append("text")
      .text("Seleziona la lista: ");
   
   var dropDownPartiti = d3.select("#myform")
      .append("select")
      .attr("class", "selection")
      .attr("name", "partiti-list")
   .attr("id", "dropDown-partiti");
    var options = dropDownPartiti.selectAll("option")
      .data(partiti)
      .enter()
      .append("option")
    .attr("partito", (d) =>{ return d});
    options.text(function(d) {
     // console.log(d)
        return d;
      })
      .attr("value", function(d) {
        return d.values;
      });
   
   
   //creo maschio/femmina/entrambi
   var genere = new Set();
   genere.add("TUTTI I CANDIDATI");
   genere.add("DONNE");
   genere.add("UOMINI");
   
    //creo dropdown genere
   d3.select("#myform")
      .append("br")
   d3.select("#myform")
      .append("text")
      .text("Seleziona il genere: ");
   
   var dropDownGenere = d3.select("#myform")
      .append("select")
      .attr("class", "selection")
      .attr("name", "genere-list")
   .attr("id", "dropDown-genere");
    var options = dropDownGenere.selectAll("option")
      .data(genere)
      .enter()
      .append("option")
    .attr("genere", (d) =>{ return d});
    options.text(function(d) {
     // console.log(d)
        return d;
      })
      .attr("value", function(d) {
        return d.values;
      });
  
   d3.select("#myform")
      .append("br")
   
   
   //pulsante cerca
    d3.select("#myform").
append("input")
        .attr("type", "button")
        .attr("value", "Cerca")
        .attr("id", "CercaFiltri")
        .on("click", (d) => { 
      //collegi
      var valore = d3.select("#dropDown-collegi").node().value 
        var data_copia;
        if(valore == "TUTTI I COLLEGI"){
          data_copia = data;
        } else {
          data_copia = data.filter(function(d){ return d.desc_ente == valore })
        }
      //lista
      var valoreLista = d3.select("#dropDown-partiti").node().value 
        
        if(valoreLista == "TUTTE LE LISTE"){
          
        } else {
          data_copia = data_copia.filter(function(d){ return d.desc_lista == valoreLista })
        }
      //genere
          var valoreGenere = d3.select("#dropDown-genere").node().value 
        
        if(valoreGenere == "TUTTI I CANDIDATI"){
          
        } else {
          data_copia = data_copia.filter(function(d){ return d.desc_lista == valoreLista })
        }
      
      resetView(data_copia)                        
                                   })
   
  

   
   //fine setup dei filtri
   
   creaIstogrammaAnniTot(data)
   
   // qui inizio a costruire la pagina
     
         
    })(jQuery); 
  
 
  
 
});
