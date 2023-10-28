import express from 'express' // Importa a biblioteca Express
import uuid from 'uuid' // Importa a biblioteca UUID 
import cors from 'cors';

const port = process.env.PORT || 3001
const app = express() 
app.use(express.json()) 
app.use(cors()) // Habilita o acesso do Front-End


const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params // Pega o ID do usuário a ser modificado 

    const index = users.findIndex(user => user.id === id) // Encontra em qual posição do array o usuário está

    if (index < 0) { // Se não encontrar a posição do usuário no array, retorna mensagem de erro
        return response.status(404).json({ message: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/', (request, response) => {
    return response.json('Helo World!')
})

app.get('/users', (request, response) => { // Rota para listar usuários
    return response.json(users)
})

app.post('/users', (request, response) => { // Rota para criar usuários
    try {
        const { name, age } = request.body

        if(age < 12) throw new Error("Only allowed users over 18 years old!") // Cria uma nova condição que se não for atendida cria um erro que faz cair automaticamente no bloco de Catch

        const user = { id: uuid.v4(), name, age }

        users.push(user) // Cria uma informação no array

        return response.status(201).json(user)
    } catch(err){
        return response.status(400).json({error:err.message})
    } finally {
        console.log("Processo finalizado!")
    }
})

app.put('/users/:id', checkUserId, (request, response) => { // Rota para atualizar

    const { name, age } = request.body // Trago no corpo da requisição as informações que quero modificar
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age } // Crio o objeto que será o novo usuário

    users[index] = updatedUser // No array de usuários, na posição do usuário, atualizo o usuário inserindo os novos dados

    return response.json(updatedUser) // Exibo o usuário já com os dados atualizados
})

app.delete('/users/:id', checkUserId, (request, response) => { // Rota para deletar
    const index = request.userIndex

    users.splice(index, 1) // Pega o ID do usuário identificado no index e exclui apenas ele

    return response.status(204).json()

})

app.listen(port, () => console.log(`Server is running on port ${port}`)) 
