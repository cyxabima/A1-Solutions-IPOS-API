import bcrypt from "bcrypt"

const hashPassword = async (password: string, round: number) => {
    return await bcrypt.hash(password, round)
}

const verifyPassword = async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword)
}



export { hashPassword, verifyPassword }