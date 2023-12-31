import Dtos from "../../data/enums/DtoEnum";
import UserDto from "../../data/DataTransferObjects/UserDto";
// import AuthDto from "../../data/DataTransferObjects/AuthDto";

const mapToDto = (data: any, type: Dtos): object => {
    switch(type) {
        case (Dtos.UserDto): {
            if (typeof data.length != 'undefined') {
                let users: UserDto[] = [];
                data.forEach((user: object) => {
                    users.push(new UserDto(user));
                });
                return users;
            }
            return new UserDto(data);
        }
    }
}

export {mapToDto};