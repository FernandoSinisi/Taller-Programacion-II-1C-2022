import {ScrollView, View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react'
import {Button, Chip, Divider, Modal, Portal, Searchbar} from "react-native-paper";

const MultiSelection = props => {
  const [allElements, setAllElements] = useState([]);
  const [text, setText] = useState('');
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const fetchAllElements = async () => {
      await props.getAllElements()
        .then(elements => setAllElements(elements))
        .catch(e => {
          console.log(`Error fetching elements: ${JSON.stringify(e)}`);
          alert(`Error fetching elements: ${JSON.stringify(e)}`);
        });
    };
    fetchAllElements();
  }, []);

  const elementShouldBeDisplayed = (text) => {
    return e => props.elementFilter(text)(e) && !props.selectedElements.map(el => el.id).includes(e.id);
  }

  function renderSelectedChip(element, id) {
    return (
      <Chip key={id}
            onClose={props.elementCallback.remove ? () => props.elementCallback.remove(element) : undefined}
            style={{backgroundColor: 'palegreen', marginVertical: 1}}
      >
        {props.renderElement(element)}
      </Chip>
    )
  }

  function renderDisplayedChip(element, id) {
    return (
      <Chip style={{marginVertical: 1}} key={id} onPress={() => {
        props.elementCallback.add(element);
      }}>
        {props.renderElement(element)}
      </Chip>
    )
  }

  return (
    <>
      <Button style={styles.buttonStyle} onPress={showModal}
              icon={props.icon}>{props.buttonText ?? 'Seleccionar'}</Button>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Searchbar onChangeText={setText}
                     placeholder={props.searchPlaceholder ?? 'Buscar'}
                     inputStyle={{}}
                     containerStyle={{}}
                     inputContainerStyle={{}}
                     value={text}
          />
          <ScrollView showsVerticalScrollIndicator={true} style={{marginTop: 10}}>
            {props.selectedElements.map(renderSelectedChip)}
            {props.selectedElements.length > 0 && (<Button onPress={props.elementCallback.clear}>Limpiar</Button>)}
            {props.selectedElements.length > 0 && (<Divider style={{marginVertical: 5}}/>)}
            {allElements.filter(elementShouldBeDisplayed(text)).map(renderDisplayedChip)}
          </ScrollView>
          <Button onPress={hideModal}>Cerrar</Button>
        </Modal>
      </Portal>
      {
        props.selectedElements.length > 0 && (
          <View style={{maxHeight: 125, marginTop: 5, marginBottom: 5}}>
            <ScrollView showsVerticalScrollIndicator={true}
                        useReference={props.selectedElements}>
              {props.selectedElements.map(renderSelectedChip)}
            </ScrollView>
          </View>
        )
      }
    </>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: 'center',
    width: '80%',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: 'skyblue'
  },
  modalContainer: {
    padding: 10,
    flexShrink: 1,
  },
  modal: {
    backgroundColor: '#f5fcff',
    padding: 15,
    margin: 15,
    height: '70%',
    flexShrink: 1,
  }
})

export default MultiSelection;
