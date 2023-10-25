import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  peopleAmount?: number;
  peopleAmountAccepted = false;

  listIsReady = false;
  peoplesRemaining?: number

  jinglePlaying = false;
  message = '';
  houseAudio = new Audio();
  
  housesIndicator: { [key: string]: number; } = {
    gryffindor: 0,
    hufflepuff: 0,
    ravenclaw: 0,
    slytherin: 0
  }
  list: Person[] = [];

  soundtrackAudio = new Audio(`../assets/harry_potter_soundtrack_loop.mp3`);
  soundtrackIsMuted = true;


  ngOnInit(): void {
    this.playSoundtrackAudio();
  }

  playSoundtrackAudio(): void {
    this.soundtrackAudio.loop = true,
    this.soundtrackAudio.load();
    this.soundtrackAudio.volume = 0.5;
  }

  acceptPeopleAmount(): void {
    if (this.peopleAmount && this.peopleAmount > 0) {
      this.peopleAmountAccepted = true;
      this.list = this.addPeoplesToList(this.peopleAmount);
      this.list = this.shuffle(this.addHouses(this.list));
      this.list = this.shuffle(this.list);
      this.listIsReady = true;
      this.peoplesRemaining = this.list.length;
      this.soundtrackAudio.volume = 0.05;
      setTimeout(()=>window.scrollTo(0, 0), 20);
    }
  }

  addPeoplesToList(peopleAmount: number): Person[] {
    const temporaryList: Person[] =[]
    for (let i = 1; i<=peopleAmount; i++) {
      temporaryList.push({index: i, house: undefined})
    }

    return this.shuffle(temporaryList)
  }

  shuffle(array: any[]): any[] {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  getRandomNumber (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  addHouses(list: Person[]): Person[] {
    const listToEdit = [...list];
    const peoplePerHouse = Math.floor(list.length / 4);

    const addHouse = (person: Person, houseName: HouseName): Person => {
      return {...person, house: houseName}
    }

    const gryffindorList = listToEdit.splice(0, peoplePerHouse).map(item => addHouse(item, HouseName.gryffindor));
    const hufflepuffList = listToEdit.splice(0, peoplePerHouse).map(item => addHouse(item, HouseName.hufflepuff));
    const ravenclawList = listToEdit.splice(0, peoplePerHouse).map(item => addHouse(item, HouseName.ravenclaw));
    const slytherinList = listToEdit.splice(0, peoplePerHouse).map(item => addHouse(item, HouseName.slytherin));

    listToEdit.forEach((item, index) => {
      if (index === 0) {
        gryffindorList.push({...item, house: HouseName.gryffindor})
      } else if (index === 1) {
        gryffindorList.push({...item, house: HouseName.hufflepuff})
      } else if (index === 2) {
        gryffindorList.push({...item, house: HouseName.ravenclaw})
      } else if (index === 3) {
        gryffindorList.push({...item, house: HouseName.slytherin})
      }
    }) 

    return this.shuffle([...gryffindorList, ...hufflepuffList, ...ravenclawList, ...slytherinList]);
  }

  playAudio(audioType: string): void {
    const gryfindorAudioVariationsAmount = 2;
    const hufflepuffAudioVariationsAmount = 2;
    const ravenclawAudioVariationsAmount = 2;
    const slytherinAudioVariationsAmount = 2;
    let audioVariant = '';
    if (audioType === HouseName.gryffindor) {
      audioVariant = this.getRandomNumber(1, gryfindorAudioVariationsAmount).toString();
    } else if (audioType === HouseName.hufflepuff) {
      audioVariant = this.getRandomNumber(1, hufflepuffAudioVariationsAmount).toString();
    } else if (audioType === HouseName.ravenclaw) {
      audioVariant = this.getRandomNumber(1, ravenclawAudioVariationsAmount).toString();
    } else if (audioType === HouseName.slytherin) {
      audioVariant = this.getRandomNumber(1, slytherinAudioVariationsAmount).toString();
    }
    this.houseAudio.src = `../assets/${audioType}-${audioVariant}.mp3`;
    this.houseAudio.load();
    this.houseAudio.play();
    this.houseAudio.onended = () => {
      this.jinglePlaying = false;
      this.message = '';
      this.list.shift();
    }
  }

  skipHouseAudio(): void {
    this.houseAudio.pause();
    this.jinglePlaying = false;
      this.message = '';
      this.list.shift();
  }

  draw(): void {
    if (this.list.length && this.peoplesRemaining) {
      this.jinglePlaying = true;
      if (this.list[0].house === HouseName.gryffindor) {
        this.message = 'Gryffindor';
        const audioSrc = HouseName.gryffindor;
        this.playAudio(audioSrc)
        this.housesIndicator.gryffindor ++;
        this.peoplesRemaining --;
      } else if (this.list[0].house === HouseName.hufflepuff) {
        this.message = 'Hufflepuff'
        const audioSrc = HouseName.hufflepuff;
        this.housesIndicator.hufflepuff ++;
        this.peoplesRemaining --;
        this.playAudio(audioSrc)
      } else if (this.list[0].house === HouseName.ravenclaw) {
        this.message = 'Ravenclaw'
        const audioSrc = HouseName.ravenclaw;
        this.housesIndicator.ravenclaw ++;
        this.peoplesRemaining --;
        this.playAudio(audioSrc)
      } else if (this.list[0].house === HouseName.slytherin) {
        this.message = 'Slytherin'
        const audioSrc = HouseName.slytherin;
        this.playAudio(audioSrc);
        this.housesIndicator.slytherin ++;
        this.peoplesRemaining --;
      }
    }
  }

  reset(): void {
    this.peopleAmount = undefined;
    this.peopleAmountAccepted = false;
  
    this.listIsReady = false;
    this.peoplesRemaining = undefined;
  
    this.jinglePlaying = false;
    this.message = '';
  
    this.housesIndicator = {
      gryffindor: 0,
      hufflepuff: 0,
      ravenclaw: 0,
      slytherin: 0
    }
  
    this.list = [];
    this.soundtrackAudio.volume = 0.5;
  }

  toggleMuteSoundtrack(): void {
    this.soundtrackAudio.play();
    this.soundtrackIsMuted = !this.soundtrackIsMuted;
    this.soundtrackAudio.muted = this.soundtrackIsMuted;
  }

}

enum HouseName  {
  'gryffindor' = '1',
  'hufflepuff' = '2',
  'ravenclaw' = '3',
  'slytherin' = '4',
}

interface Person {
  index: number,
  house: HouseName | undefined
};