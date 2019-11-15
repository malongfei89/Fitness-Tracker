import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://ec2-3-134-94-92.us-east-2.compute.amazonaws.com:3000'
  })
}
