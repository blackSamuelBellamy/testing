const request = require("supertest")
const server = require("../index")

const creatingNewId = arr => {
    const totalIDs = arr.map(item => item.id).sort((a, b) => b - a)
    totalIDs.splice(1, totalIDs.length - 1)
    const newId = totalIDs[0] + 1
    return newId
}

describe("Operaciones CRUD de cafes", () => {
    it(`
    a- STATUS CODE SHOULD BE 200.
    b- BODY IS AN ARRAY.
    c- ARRAY LENGTH > 0.`,
        async () => {
            const { body, statusCode } = await request(server).get('/cafes').send()
            expect(statusCode).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body.length).toBeGreaterThanOrEqual(1)
        })

    it('EXPECTING 404 STATUS CODE AFTER DELETE A NON-EXISTENT ID',
        async () => {
            const jwt = "token"
            const { body } = await request(server).get('/cafes').send()
            const idToDelete = creatingNewId(body)
            const { statusCode } = await request(server).delete(`/cafes/${idToDelete}`)
            .set('Authorization', jwt).send()
            expect(statusCode).toBe(404)
        })

    it('ADDING A NEW COFFE AND EXPECTING 201 STATUS CODE', async () => {
        const { body } = await request(server).get('/cafes').send()
        const newID = creatingNewId(body)
        const { statusCode } = await request(server).post('/cafes').send({
            id: newID,
            nombre: 'Your new Brand coffee-name!'
        })
        expect(statusCode).toBe(201)
    })

    it('EXPECTING 400 STATUS CODE TRYING UPDATING A COFFEE WITH A DIFFERENT OR NON-EXISTING ID',
        async () => {
            const { body } = await request(server).get('/cafes').send()
            const newID = creatingNewId(body)
            const firstCoffee = body[0]
            const { statusCode } = await request(server).put(`/cafes/${newID}`).send(firstCoffee)
            expect(statusCode).toBe(400)
        })
})
