import Monk from 'monk'
import { DB_ADDRESS } from '../config.json'

export default Monk(DB_ADDRESS)
