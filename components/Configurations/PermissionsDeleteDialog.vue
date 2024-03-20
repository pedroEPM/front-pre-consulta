<template>
    <v-dialog max-width="300" v-model="dialog">
        <v-card>
            <v-card-title>Eliminar permiso</v-card-title>
            <v-card-text v-if="!loading">
                ¿Esta seguro de querer eliminar el permiso seleccionado?
            </v-card-text>
            <v-card-text v-if="loading">Eliminando permiso</v-card-text>
            <v-card-actions v-if="!loading">
                <v-spacer />
                <v-btn text color="" @click="dialog = false ">Cancelar</v-btn>
                <v-btn text color="red" @click="deletePermission()">Eliminar</v-btn>
            </v-card-actions>
            <v-progress-linear
                indeterminate
                color="primary"
                v-if="loading"
            ></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        data(){
            return {
                dialog : false,
                id: null,
                loading : false,
            }
        }, 
        methods : {
            openDialog( item ){
                this.id = item._id;
                this.dialog = true;
            },
            async deletePermission(){
                try {
                    const response = await this.$axios.delete('/permissions/' + this.id, {
                        headers : { Authorization : 'Bearer ' + localStorage.token }
                    });

                    if(response){
                        this.$store.commit(
                            'openSnack',
                            'El permiso se ha eliminado con éxito'
                        )
                        this.id = null;
                        this.dialog = false;
                        this.loading = false;
                        this.$parent.$parent.getPermissions();
                    }
                } catch (error) {
                    console.log(error.response);
                    this.loading = false;
                    this.$store.commit(
                        'openSack',
                        'Ha ocurrido un error, vuelva a intentarlo'
                    )
                }
            }
        }
    }
</script>

<style>

</style>