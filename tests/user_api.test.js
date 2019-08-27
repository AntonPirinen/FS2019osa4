const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const user = new User({ username: 'root', password: 'sekret' })
      await user.save()
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersInDb = async () => {
            const users = await User.find({})
            return users.map(u => u.toJSON())
        }
        
        const usersAtStart = await usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('`username` to be unique')
    
        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
      })

      test('creation fails with proper statuscode and message if credientals do not validate', async () => {
        const usersInDb = async () => {
            const users = await User.find({})
            return users.map(u => u.toJSON())
        }
        
        const usersAtStart = await usersInDb()
    
        const newUser = {
          username: 'ro',
          name: 'Su',
          password: '',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('crediental length must be three characters')
    
        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
      })

    test('creation succeeds with a fresh username', async () => {
        const usersInDb = async () => {
            const users = await User.find({})
            return users.map(u => u.toJSON())
        }
     
        const usersAtStart = await usersInDb()
  
      const newUser = {
        username: 'joku',
        name: 'Joku Tyyppi',
        password: 'salainen'
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
})

afterAll(() => {
    mongoose.connection.close()
  })