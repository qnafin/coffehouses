import AsyncStorage from '@react-native-community/async-storage';


const token = {
    hash() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 50; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        return text;
    },
    getToken() {
        return AsyncStorage.getItem('@UserToken:key')
            .then((response) => {
                if(response !== null) {
                    return response;
                } else {
                    //return this.setToken().then((response)=>response);
                    return false
                }
            });

    },
    async setToken(hash) {
        try {
            //let hash = this.hash();
            let token = "Bearer "+hash
            await AsyncStorage.setItem('@UserToken:key', token);
            console.log('CREATE TOKEN', token);
            return token;
        } catch (error) {
            console.log(error);
        }
    },
    async delToken() {
        await AsyncStorage.removeItem('@UserToken:key');
        console.log('DELETE TOKEN');
    }
}

//token.setToken('111');
token.getToken().then((response)=> console.log(response));
//token.delToken();

module.exports = token;

