<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
// import { doc, getDoc, updateDoc } from "@firebase/firestore";
import {
  updateDoc,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { ref } from "vue";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, db, storage } from "../../firebase";
import CustomHeader from "../components/organisms/header.vue";
import Miniheader from "../components/organisms/miniheader.vue";
// import router from "@/router";
import { useRouter } from "vue-router";

const router = useRouter()

const name = ref();
const userName = ref();
const profile = ref();
const userData = ref();
// const loginUser:any = ref();

const uid = ref();

const fileName = ref();
const gsRef = ref();
const iconUrl = ref();
const postList = ref([]);
const postListComments = ref([]);

const show = ref(false);

onAuthStateChanged(auth, (currentUser: any) => {
  console.log(currentUser.uid);
  uid.value = currentUser.uid;
  const loginUserData = doc(db, "users", currentUser.uid);
  // loginUser.value = loginUserData
  getDoc(loginUserData).then((data) => {
    // const data = (resultUserData.id, " => ", resultUserData.data());
    userData.value = data.data();
    iconUrl.value = userData.value.icon;
    name.value = userData.value.name;
    userName.value = userData.value.userName;
    profile.value = userData.value.profile;
  });


const anotherQ = query(
    collection(db, "posts"),
    where("userId", "==", uid.value),
  );

  getDocs(anotherQ).then((ownQSnapshot) => {
    ownQSnapshot.forEach((docdata) => {
      const data = (docdata.id, " => ", docdata.data());
      postList.value.push(
        data.postId
      );
    });
  });

 


  // const another = query(
  //   collection(db, "posts"),
  //   // where("userId", "==", uid.value),
  // );

  // getDocs(another).then((ownQSnapshot) => {
  //   ownQSnapshot.forEach((docdata) => {
  //     const data = (docdata.id, " => ", docdata.data());
  //     if( data.comments !== []){
  //       postListComments.value.push(
  //       data.comments
  //     );
  //     }else{
  //       console.log(kara)
  //     }

  //   });
  // });

  // console.log(postListComments.value)
});



const uploadButton = (e: any): void => {
  const file = e.target.files[0];
  fileName.value = file;
  const gsReference = storageRef(storage, `${uid}/icon/${file.name}`);

  gsRef.value = gsReference;

  uploadBytesResumable(gsReference, file).then(() => {
    console.log("??????????????????");
    getDownloadURL(gsReference).then((url) => {
      // ???????????????????????????????????????????????????ref?????????
      iconUrl.value = url;
    });
  });
};


const change = (): void => {
  updateDoc(doc(db, "users", uid.value), {
    name: name.value,
    userName: userName.value,
    profile: profile.value,
    icon: iconUrl.value,
  });

  router.push("/myAccountPage/post");

  postList.value.forEach((postid)=>{
    updateDoc(doc(db, "posts", postid), {
    userName: userName.value,
    icon: iconUrl.value,
  });

  })

  // updateDoc(anotherQ, {
  //   userName: userName.value,
  //   icon: iconUrl.value,
  // });



  // show.value = true;
};

// const close = () => {
  // show.value = false;
  // router.push("/myAccountPage/post");
// };
</script>

<template>

  <CustomHeader />
  <Miniheader />

  <div class = "soto">

  
  <div class="profileChange-header250">
    <div class="profileChange">
      <form @submit.prevent="change">
        <div class="profileChangeIconChange">
            <div v-if="iconUrl !== '' ">
            <img v-bind:src="iconUrl" alt="icon" class="profileChangeIconImg" />
          </div>
          <div v-else>
            <img src="../../public/noIcon.png" alt="icon" class="profileChangeIconImg" />
          </div>
          <div class="profileChangeIconInput">
            <label htmlFor="iconUpload">?????????????????????????????????</label>
            <input
              name="iconUpload"
              id="iconUpload"
              type="file"
              accept=".png, .jpeg, .jpg"
              @change="uploadButton"
              class="uploadInput"
            />
          </div>
        </div>

        <div class="profileChangeThreeChange">
          <div class="profileChangeName">
            ??????<input v-model="name" class="profileChangeInput" />
          </div>
          <div class="profileChangeUserName">
            ?????????????????????<input
              v-model="userName"
              class="profileChangeInput"
            />
          </div>
          <div class="profileChangeprofile">
            ??????????????????<input v-model="profile" class="profileChangeInput" />
          </div>
        </div>

        <button class="profileChangeButton">??????</button>

              <!--  ???????????????????????????  -->
  <!-- <div v-show="show"> -->
    <!--   ???????????????????????????????????????   -->
    <!-- <button @click="close">??</button> -->
    <!--   ????????????????????????????????????   -->
    <!-- <p>??????????????????????????????</p> -->
  <!-- </div> -->

      </form>
    </div>
  </div>

</div>
</template>

<style>
.soto{
    overflow: hidden;
    
}
.profileChange-header250 {
  margin-left: 490px;
  margin-top: 50px;
  height: 425px;
  border: solid 1px silver;
  width: 800px;
}
.profileChange {
  margin: auto;
  width: 800px;
  font-size: 15px;
  font-weight: bold;
  /* border: solid 1px silver; */
  /* height: 425px; */
}
.profileChangeIconChange {
  display: flex;
  margin-top: 40px;
  margin-left: 85px;
  margin-bottom: 50px;
}
.profileChangeIconInput {
  padding-top: 15px;
  padding-left: 30px;
  color: #1596f7;
  font-size: 12px;
}

.profileChangeButton {
  background-color: #1596f7;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  width: 100px;
  margin: 30px;
  padding: 3px;
  margin-top: 60px;
  margin-left: 350px;
}

.profileChangeIconImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
   border: solid 1px silver;
  background-color: white;
}

.profileChangeThreeChange {
  margin-top: 40px;
  margin-left: 20px;
  width: 700px;
}

.profileChangeName {
  margin-left: 74px;
  width: 100%;
  margin-top: 40px;
}

.profileChangeprofile {
  margin-left: 16px;
  margin-top: 40px;
  width: 100%;
}

.profileChangeUserName {
  margin-top: 40px;
  width: 100%;
}

.profileChangeInput {
  margin-left: 20px;
  width: 70%;
}

.uploadInput {
  display: none;
}

/* .profileChange{
    margin-left: 450px;
    margin-right: 100px;
    margin-top: 50px;
    font-size: 15px;
    font-weight: bold;
    border : solid 1px silver;
}
.profileChangeIconChange{
    display: flex;
    margin-top: 40px;
    margin-left: 85px;
    margin-bottom: 50px;
}
.profileChangeIconInput{
    padding-top: 15px;
    padding-left: 30px;
    color: #1596F7;
    font-size: 12px;
}
.profileChangeButton{
    background-color: #1596F7;
    color: white;
    font-weight: bold;
    border-radius: 20%;
    width: 100px;
    margin:30px;
    padding: 3px;
    margin-top: 60px;
    margin-left: 420px;
}
.profileChangeIconImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    
}
.profileChangeThreeChange{
    margin-top: 40px;
    margin-left: 20px;

}
.profileChangeName{
    margin-top: 40px;
    margin-left: 74px;
}
.profileChangeprofile{
    margin-top: 40px;
    margin-left: 16px;
}
.profileChangeUserName{
    margin-top: 40px;
}
.profileChangeInput{
    margin-left: 20px;
    width:700px
} */
</style>
