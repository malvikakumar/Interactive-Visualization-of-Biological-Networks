// function pathwayLogic(dish)
// {
$(function(){ // on dom ready

//Reading json file in d3 and extracting nodes and links info
var rids_array=[];
var nodes=[];
var links=[];
var layoutPadding = 50;
var layoutDuration = 800;

var dish = 'hrasDish';
var file = './Data/' + dish + '.json';

d3.json(file, function(err, data1) {
  data1.rids.forEach(function(d1){
    //console.log(d1);
    rids_array.push(d1);
  });

//Reading rules.json to get info about links, nodes and labels
    d3.json('./Data/rules.json', function(err, data2) {
      debugger
      // var data2 = data2;
      //var nodeRadius = 15;
      rids_array.forEach(function(d1){
        var dishes = d1;
        
        var rules = data2[dishes];
        
        nodes.push({ data: { id: rules.shortname, type:'rules', nodeShape:'rectangle', nodeColor:"#d62728" } })
        rules.consumed.forEach(function(cs){
          
           nodes.push({ data: { id: cs, type:'consumed', nodeShape:'ellipse', nodeColor:"#1f77b4" } })
           links.push({ data: { source: cs, target: rules.shortname, type:'change', lineStyle:"solid", lineColor:"black" } })
          
        });
        rules.produced.forEach(function(p){
          nodes.push({ data: { id: p, type:'produced', nodeShape:'ellipse', nodeColor:"#9ecae1" } })
           links.push({ data: { source: rules.shortname, target: p, type:'change', lineStyle:"solid", lineColor:"black" } })
          
        });
        rules.controls.forEach(function(con){
          nodes.push({ data: { id: con, type:'controls', nodeShape:'ellipse', nodeColor:"#1f77b4" } })
           links.push({ data: { source: con, target: rules.shortname, type:'nochange', lineStyle:"solid", lineColor:"green" } })
         
        });
        // debugger
      });
 console.log("No. of nodes: "+nodes.length);
console.log("No. of links: "+links.length);


var config = {
  container: document.getElementById('cy'),
  
  boxSelectionEnabled: false,
  autounselectify: true,
  
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'height': 200,
        'width': 300,
        'background-fit': 'cover',
        'border-color': '#000',
        'border-width': 5,
        // 'border-opacity': 0.5,
        'background-color': 'data(nodeColor)',
        'shape': 'data(nodeShape)',
        'label': 'data(id)',
        'font-size': 80
  //       
      })
    
    .selector('edge')
      .css({
        'width': 10,
        'target-arrow-shape': 'triangle',
        // 'line-color': '#ffaaaa',
        'target-arrow-color': 'black',
        'line-style': 'data(lineStyle)',
        'line-color': 'data(lineColor)'
      })

    .selector('.highlighted')
      .css({})

    .selector('.faded')
         .css({
          // 'background-opacity': 0.3,
          'border-opacity': 0,
          'opacity': 0
         }),
  
  layout: {
    name: 'dagre',
    directed: true,
    padding: layoutPadding,
    rankDir: 'TB', 
    align: 'TB',
    rankSep: 1000,
    nodeSep: 300,
    // edgeSep: 200
    animate: true,
     animationDuration: 500,
  }
   

}

//Converting nodes and links read in d3 to cytoscape json format
  var my_elements = {
    nodes: nodes,
    edges: links
  }

console.log(my_elements);

 config.elements = my_elements;

  var cy = cytoscape(config);

  cy.on('click', 'node', function(e){
      var node = this;

      highlight(node);
      // showNodeInfo( node );
    });

  // var nonNodes = cy.elements().not('nodes');
  // var nonEdges = cy.elements().not('edges');
  // var emptySpace = cy.collection(nonNodes);
  // emptySpace = emptySpace.add(nonEdges);

  // emptySpace.on('tap', function(e){
  //   cy.elements().removeClass('faded').addClass('highlighted');
  //   cy.stop().animate({
  //       fit:{
  //         eles: cy.elements(),
  //         padding: layoutPadding

  //       }
  //     },
  //     {
  //       duration: layoutDuration
  //     }).delay( layoutDuration, function(){
  //       cy.elements().layout({
          
  //   name: 'dagre',
  //   directed: true,
  //   padding: layoutPadding,
  //   rankDir: 'TB', 
  //   align: 'TB',
  //   rankSep: 500,
  //   nodeSep: 500,
  //   // edgeSep: 200
  //   animate: true,
  //    animationDuration: 500,
  
  //       });
  //     } );
  // })


    // cy.on('unselect', 'node', function(e){
    //   var node = this;

    //   clear();
    //   hideNodeInfo();
    // });

 function highlight( node ){
  
  var node_name = node._private.data.id;
  var node_type = node._private.data.type;
  var embed_name = '<center><p>'+node_name+'</p>';
  var embed_type = '';
  if(node_type == 'rules')
    embed_type = '<center><p>Type: Rule</p>';
  else
    embed_type = '<center><p>Type: Occurence</p>';

    // var $clear = $('#clear');

    cy.nodes().qtip({
      content: {
        text: function(){
          var $ctr = $('<div class="select-buttons"></div>');
          var $name = $(embed_name);
          var $type = $(embed_type);
          var $successor = $('<center><button id="successor">Down Stream</button></br>');
          var $predecessor = $('<center><button id="predecessor">Up Stream</button></br>');
          var $subgraph = $('<center><button id="subgraph">Sub Graph</button>');
          
          $successor.on('click', function(){
            nodeSuccessor(node);
            node.qtip('api').hide();
          });

          $predecessor.on('click', function(){
            nodePredecessor(node);
            node.qtip('api').hide();
          });

          $subgraph.on('click', function(){
            nodeSubgraph(node);
            node.qtip('api').hide();
          });
          
          $ctr.append( $name ).append( $type ).append( $successor ).append( $predecessor ).append( $subgraph );
          
          return $ctr;
        }
        // text: qTipInfo(node);
      },
      show: {
        solo: true
      },
      position: {
        my: 'top center',
        at: 'bottom center',
        adjust: {
          method: 'flip'
        }
      },
      style: {
        classes: 'qtip-bootstrap',
        tip: {
          width: 16,
          height: 8
        }
      }
      })
        // $clear.on('click', clear);
    }
  // });


    function nodeSuccessor(node)
    {
      var nhood = node.successors();
      cy.batch(function(){
      cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');

      var collection = cy.collection(nhood);

      collection.forEach(function(d){
        var current_node = d.incomers();
        collection = collection.add(current_node);
      })

      collection = collection.add(node);
      debugger

      collection.removeClass('faded').addClass('highlighted');
      animateCollection(collection);

      // cy.stop().animate({
      //   fit:{
      //     eles: collection,
      //     padding: layoutPadding

      //   }
      // })
      
    });
    }


    function nodePredecessor(node)
    {
      var nhood = node.predecessors();
      cy.batch(function(){
      cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');

      var collection = cy.collection(nhood);
      collection = collection.add(node);

      collection.forEach(function(d){
        var current_node = d.incomers();
        collection = collection.add(current_node);
      })

      collection.removeClass('faded').addClass('highlighted');

      animateCollection(collection);
    });
    }

    function nodeSubgraph(node)
    {
      var nhood = node.successors();
      var nhood2 = node.predecessors();
      cy.batch(function(){
      cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');

      var collection = cy.collection(nhood);
      collection = collection.add(nhood2);
      collection = collection.add(node);

      collection.forEach(function(d){
        var current_node = d.incomers();
        collection = collection.add(current_node);
      })

      collection.removeClass('faded').addClass('highlighted');

     animateCollection(collection);
    });
    }

    function animateCollection(collection)
    {
      debugger
        cy.stop().animate({
        fit:{
          eles: collection,
          padding: layoutPadding

        }
      },
      {
        duration: layoutDuration
      }).delay( layoutDuration, function(){
        collection.layout({
          
    name: 'dagre',
    directed: true,
    padding: layoutPadding,
    rankDir: 'TB', 
    align: 'TB',
    rankSep: 500,
    nodeSep: 500,
    // edgeSep: 200
    animate: true,
     animationDuration: 800,
  
        });
      } );
    } //animateCollection() ends

    
    // //Dijkstras
    // var node2= "#Mnk1-act@CLc";
    // var dijkstra = cy.elements().dijkstra(node,function(){return this.data('id');});
    // var nhood = dijkstra.pathTo(cy.$('#665'));
 
    
  // }

   function clear(){
    cy.batch(function(){
      cy.$('.highlighted').forEach(function(n){
        n.animate({
          position: n.data('orgPos')
        });
      });
      
      cy.elements().removeClass('highlighted').removeClass('faded');
    });
  }

  });

}); // on dom ready
});
// }