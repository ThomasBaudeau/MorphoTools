/*
  Thomas Baudeau / Gregory Bordier / Valentin Gonay / GOMES Enzo / JACQUES Patrick / SAUVESTRE Clément*
  class.js : Classes
  Version 1.5.0
*/

class Node{
  constructor(id,pos,style){
      this.id=id;
      this.pos=pos;
      this.link=[];
      this.style=style
  }
  AddEdge(id,prob){
      this.link.push({'id':id,'prob':prob});
  }
  SetLabel(e,id){
      for(let l =0;l<this.link.length;l++){
          if (this.link[l].id==id){
              this.link[l]={'id':this.link[l].id,'prob':this.link[l].prob,'label':e}
          }
      }       
  }
  Getid(){
      return this.id;
  }
  Getposx(){
      return this.pos[0];
  }
  Getposy(){
      return this.pos[1];
  }
  Getedges(){
      return this.link;
  }
  Getstyle() {
      return this.style;
  }
}

class Assembly{
  constructor(name,nodes){
      this.nodes=nodes;
      this.name=name
  }
  makeJson(){
          var json = 
      {"elements": {
      "nodes" : [],
      "edges" : []
      },
      "style": [
      {"selector":"node","style":{"height":"10px","width":"10px","shape":"rectangle","background-fit":"cover","border-color":"rgb(0,0,0)","border-width":"0px","border-opacity":"0.5"}},
      {"selector":"edge","style":{"width":"0.1px","target-arrow-shape":"triangle","arrow-scale":"0.1","line-color":"rgb(0,0,0)","target-arrow-color":"rgb(0,0,0)"}}
      ],
      "data":{},
      "zoomingEnabled":true,
      "userZoomingEnabled":true,
      "zoom":6.009433962264151,
      "minZoom":1e-50,
      "maxZoom":1e+50,
      "panningEnabled":true,
      "userPanningEnabled":true,
      "pan":{"x":-2357.7169811320755,"y":255},
      "boxSelectionEnabled":false,
      "renderer":{"name":"canvas"}
      };
      let data = {
          "data":{
              "id": this.name,
              "label": this.name,
          },
          "position":{"x":0,"y":0},
          "group":"nodes",
          "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
          };
          json.elements.nodes.push(data);
      var existent_node=[];
      for (let i=0;i<this.nodes.length;i++){
          existent_node.push(this.nodes[i].Getid());
          let data = {
              "data":{
                  "id": this.nodes[i].Getid(),
                  "label": '',
                  "parent":this.name
              },
              "position":{"x":this.nodes[i].Getposx(),"y":this.nodes[i].Getposy()},
              "group":"nodes",
              "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
              };
              json.elements.nodes.push(data);
          }
      var cpt=0;
      for (let y=0;y<this.nodes.length;y++){
          var link=this.nodes[y].Getedges();
          for(let j=0;j<link.length;j++){
              if (existent_node.includes(link[j].id)){
                  let id = 'E' + cpt;
                  cpt++;
                  let data = {
                      "data":{
                      "id": id,
                      "label":link[j].label,
                      "proba":link[j].prob,
                      "source":this.nodes[y].Getid(),
                      "target":link[j].id
                      },
                      "position":{"x":0,"y":0},
                      "group":"edges",
                      "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""
                  };
                  json.elements.edges.push(data);
                  }
              }   

          }
          return JSON.stringify(json)
      }
  makemultiJson(assemblies){
      var existent_node=[];
      var cpt=0;
      var json = 
      {"elements": {
      "nodes" : [],
      "edges" : []
      },
      "style": [
      {"selector":"node","style":{"height":"10px","width":"10px","shape":"rectangle","background-fit":"cover","border-color":"rgb(0,0,0)","border-width":"0px","border-opacity":"0.5"}},
      {"selector":"edge","style":{"width":"0.1px","target-arrow-shape":"triangle","arrow-scale":"0.1","line-color":"rgb(0,0,0)","target-arrow-color":"rgb(0,0,0)"}}
      ],
      "data":{},
      "zoomingEnabled":true,
      "userZoomingEnabled":true,
      "zoom":6.009433962264151,
      "minZoom":1e-50,
      "maxZoom":1e+50,
      "panningEnabled":true,
      "userPanningEnabled":true,
      "pan":{"x":-2357.7169811320755,"y":255},
      "boxSelectionEnabled":false,
      "renderer":{"name":"canvas"}
      };  
      let data = {
          "data":{
              "id": this.name,
              "label": this.name,
          },
          "position":{"x":0,"y":0},
          "group":"nodes",
          "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
          };
          json.elements.nodes.push(data);
      for (let i=0;i<this.nodes.length;i++){
          existent_node.push(this.nodes[i].Getid());
          let data = {
              "data":{
                  "id": this.nodes[i].Getid(),
                  "label": '',
                  "parent":this.name
              },
              "position":{"x":this.nodes[i].Getposx(),"y":this.nodes[i].Getposy()},
              "group":"nodes",
              "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
              };
              json.elements.nodes.push(data);
          }
      for (let i=0;i<assemblies.length;i++){
          let data = {
              "data":{
                  "id": assemblies[i].getname(),
                  "label": assemblies[i].getname(),
              },
              "position":{"x":0,"y":0},
              "group":"nodes",
              "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
              };
              json.elements.nodes.push(data);
              let nodes=assemblies[i].getNodes();
              var name= assemblies[i].getname();
              for (let i=0;i<nodes.length;i++){
                  existent_node.push(nodes[i].Getid());
                  let data = {
                      "data":{
                          "id": nodes[i].Getid(),
                          "label": '',
                          "parent":name
                      },
                      "position":{"x":nodes[i].Getposx(),"y":nodes[i].Getposy()},
                      "group":"nodes",
                      "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""
                      };
                      json.elements.nodes.push(data);
                  }
              for (let y=0;y<nodes.length;y++){
                  var link=nodes[y].Getedges();
                  for(let j=0;j<link.length;j++){
                      if (existent_node.includes(link[j].id)){
                          let id = 'E' + cpt;
                          cpt++;
                          let data = {
                              "data":{
                              "id": id,
                              "label":link[j].label,
                              "proba":link[j].prob,
                              "source":nodes[y].Getid(),
                              "target":link[j].id
                              },
                              "position":{"x":0,"y":0},
                              "group":"edges",
                              "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""
                          };
                          json.elements.edges.push(data);
                      }
                  }
              }
          }
          for (let y=0;y<this.nodes.length;y++){
              var link=this.nodes[y].Getedges();
              for(let j=0;j<link.length;j++){
                  if (existent_node.includes(link[j].id)){
                      let id = 'E' + cpt;
                      cpt++;
                      let data = {
                          "data":{
                          "id": id,
                          "label":link[j].label,
                          "proba":link[j].prob,
                          "source":this.nodes[y].Getid(),
                          "target":link[j].id
                          },
                          "position":{"x":0,"y":0},
                          "group":"edges",
                          "removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""
                      };
                      json.elements.edges.push(data);
                      }
                  }   
  
              }
              return JSON.stringify(json)

  }
  getNodes(){
      return this.nodes;
  }
  addNodes(linodes){
      for (let node in linodes){
          this.nodes.push(node);
      }
  }
  getname(){
      return this.name;
  }
  setlabelPosition(){
      for(let i=0; i<this.nodes.length;i++){
          var slct_node= this.nodes[i];
          var edges=slct_node.Getedges()
          for(let v=0;v<edges.length;v++){
              for(let d=0;d<this.nodes.length;d++){
                  if (this.nodes[d].Getid()==edges[v].id){
                      let tx=this.nodes[d].Getposx();
                      let ty=this.nodes[d].Getposy();
                      let sy=slct_node.Getposy();
                      let sx=slct_node.Getposx();
                      if(Math.abs(sx-tx)<Math.abs(sy-ty)){
                          if(sy<ty){
                              this.nodes[i].SetLabel('H',edges[v].id);
                          }
                          else{
                              this.nodes[i].SetLabel('B',edges[v].id);
                          }
                      }
                      else{
                          if(sx<tx){
                              this.nodes[i].SetLabel('D',edges[v].id);
                          }
                          else{
                              this.nodes[i].SetLabel('G',edges[v].id);
                          }
                      }
                  }
              }
          }
      }
  }

  FindNodeStyle(node){
      for (let i=0;i<this.nodes.length;i++){
          if (this.nodes[i].Getid()==node){
              return this.nodes[i].Getstyle();
          }
      }
  }
}