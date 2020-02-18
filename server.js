
//CONFIGURANDO O SERVIDOR
const express = require('express');
const server = express();



//configurar o servidor para apresentar os arquivos estaticos

server.use(express.static('public'))

//habilitar body do formulario

server.use(express.urlencoded({extended:true}))


//configurar a conexao com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'vicente12',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


//CONFIGURANDO A TEMPLATE ENGINE

const nunjucks = require("nunjucks");
nunjucks.configure("./",{
    express: server,
    noCache: true,
})










//CONFIGURAR APRESENTAÇÃO DA PAGINA
server.get("/" , function(req,res){
    db.query("SELECT * FROM donors ORDER BY donors desc LIMIT 4",(err,result)=>{
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
        
        return res.render("index.html",{donors})
    })
   
})

server.post("/", function(req,res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos sao Obrigatorios")
    }

   
    //coloco valores dentro do banco de dados
    const query = `INSERT INTO donors ("name","email","blood") VALUES ($1,$2,$3)`
    
    const values = [name,email,blood];

    db.query(query,values, function(err){
        //fluxo de erro
        if(err) return res.send("erro no banco de dados.");

        //fluxo ideal
        return res.redirect("/")
    })

    

})


//LIGAR O SERVIDOR E PERMITIR O ACESSO NA PORTA 3000

server.listen(3000,()=>{
    console.log("Iniciei o Servidor")
})