const express = require('express');
const mysql = require('mysql2');

const app = express();

const porta = 3001

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const conectar = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '909290',
    database: 'techstore'
});

// Home
app.get('/', (req, res) => {
    const query = 'SELECT Produtos.ID_Produtos, Produtos.Nome_Produtos, Produtos.Preco, Cliente.Nome_Cliente, Categoria.Nome_Categorias FROM Produtos INNER JOIN Cliente ON Produtos.ID_Cliente = Cliente.ID_Cliente INNER JOIN Categoria ON Produtos.ID_Categorias = Categoria.ID_Categorias';
    conectar.query(query, (err, results) => {
        res.render('index', {registros: results});
    });
});

// CLIENTE


// rota para a pág formulário cliente
app.get('/cliente/form', (req, res) => {
    res.render('form', { tipo: 'cliente' });
});


// rota do formulário cliente para o banco
app.post('/cliente/adicionar', (req, res) => {

    const { Nome_Cliente, Email, Telefone } = req.body;

    conectar.query(
        'INSERT INTO Cliente (Nome_Cliente, Email, Telefone) VALUES (?, ?, ?)',
        [Nome_Cliente, Email, Telefone],
        () => res.redirect('/')
    );
});



// PRODUTO

// rota para a pág formulário produto
app.get('/produto/form', (req, res) => {

    conectar.query('SELECT * FROM Cliente', (err, clientes) => {
        conectar.query('SELECT * FROM Categoria', (err, categorias) => {

            res.render('form', {
                tipo: 'produto',
                clientes,
                categorias
            });

        });
    });

});

// criar produto
app.post('/produto/adicionar', (req, res) => {

    const { Nome_Produtos, Preco, ID_Cliente, ID_Categorias } = req.body;

    conectar.query(
        'INSERT INTO Produtos (Nome_Produtos, Preco, ID_Cliente, ID_Categorias) VALUES (?, ?, ?, ?)',
        [Nome_Produtos, Preco, ID_Cliente, ID_Categorias],
        () => res.redirect('/')
    );
});



// CLIENTE

// Abrir tela editar cliente
app.get('/cliente/editar/:id', (req, res) => {

    conectar.query(
        'SELECT * FROM Cliente WHERE ID_Cliente = ?',
        [req.params.id],
        (err, results) => {

            res.render('editar', {
                tipo: 'cliente',
                registro: results[0]
            });

        }
    );
});

// editar Cliente e salvar
app.post('/cliente/atualizar', (req, res) => {

    const { ID_Cliente, Nome_Cliente, Email, Telefone } = req.body;

    conectar.query(
        'UPDATE Cliente SET Nome_Cliente=?, Email=?, Telefone=? WHERE ID_Cliente=?',
        [Nome_Cliente, Email, Telefone, ID_Cliente],
        () => res.redirect('/')
    );
});

// deletar cliente
app.get('/cliente/deletar/:id', (req, res) => {

    conectar.query('DELETE FROM Produtos WHERE ID_Cliente=?', [req.params.id], () => {

        conectar.query(
            'DELETE FROM Cliente WHERE ID_Cliente=?',
            [req.params.id],
            () => res.redirect('/')
        );

    });

});



// PRODUTO

// Abrir tela editar produto
app.get('/produto/editar/:id', (req, res) => {

    conectar.query(
        'SELECT * FROM Produtos WHERE ID_Produtos=?',
        [req.params.id],
        (err, results) => {

            const produto = results[0];

            conectar.query('SELECT * FROM Cliente', (err, clientes) => {
                conectar.query('SELECT * FROM Categoria', (err, categorias) => {

                    res.render('editar', {
                        tipo: 'produto',
                        registro: produto,
                        clientes,
                        categorias
                    });

                });
            });

        }
    );
});

// editar produto e salvar
app.post('/produto/atualizar', (req, res) => {

    const { ID_Produtos, Nome_Produtos, Preco, ID_Cliente, ID_Categorias } = req.body;

    conectar.query(
        'UPDATE Produtos SET Nome_Produtos=?, Preco=?, ID_Cliente=?, ID_Categorias=? WHERE ID_Produtos=?',
        [Nome_Produtos, Preco, ID_Cliente, ID_Categorias, ID_Produtos],
        () => res.redirect('/')
    );
});

// deletar produto
app.get('/produto/deletar/:id', (req, res) => {

    conectar.query(
        'DELETE FROM Produtos WHERE ID_Produtos=?',
        [req.params.id],
        () => res.redirect('/')
    );

});


//CATEGORIAS

// rota para a pág formulário categorias
app.get('/categoria/form', (req, res) => {
    res.render('form', { tipo: 'categoria' });
});


// rota do formulário categorias para o banco
app.post('/categoria/adicionar', (req, res) => {

    const { Nome_Categorias } = req.body;

    conectar.query(
        'INSERT INTO Categoria (Nome_Categorias) VALUES (?)',
        [Nome_Categorias],
        () => res.redirect('/')
    );
});



//Inicia o servidor
app.listen(porta, () => {

    console.log(`Servidor iniciado em http://localhost:${porta}`);

});