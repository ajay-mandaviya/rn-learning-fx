/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { SketchCanvas } from '@sourcetoad/react-native-sketch-canvas';
import ViewShot from 'react-native-view-shot';
import {
  saveToFile,
  shareToInstagramStory,
  shareToInstagramStoryV2,
} from '../utils/utils';

const { width: screenWidth } = Dimensions.get('window');
const MAX_PREVIEW_WIDTH = screenWidth - 32; // 16 margin left & right
const COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
];

const STICKER_LIBRARY = [
  require('../assets/images/Sticker1.png'),
  require('../assets/images/Sticker2.png'),
  require('../assets/images/Sticker3.png'),
];

const UserProfilePicture = () => {
  const canvasRef = useRef<any>(null);
  const viewShotRef = useRef<any>(ViewShot);
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [activeStickers, setActiveStickers] = useState<any[]>([]);

  const addSticker = (uri: any) => {
    const newSticker = {
      id: Date.now(),
      uri,
      x: 50,
      y: 50,
    };
    setActiveStickers(prev => [...prev, newSticker]);
  };

  const onSelectImage = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo' });

    if (res?.assets?.length) {
      const image = res.assets[0];

      if (image.width && image.height) {
        // Calculate scaled height to maintain aspect ratio within MAX_PREVIEW_WIDTH
        const scaleFactor = MAX_PREVIEW_WIDTH / image.width;
        const scaledHeight = image.height * scaleFactor;

        setImageDimensions({
          width: MAX_PREVIEW_WIDTH,
          height: scaledHeight,
        });
      }
      if (canvasRef.current) {
        canvasRef?.current?.clear();
      }

      setSelectedImage(image);
    }
  };

  const onSavePress = async () => {
    console.log('Save and share-->');
    const uri = await viewShotRef?.current?.capture();
    const newFilePath = await saveToFile(uri);
    console.log('New File path-->', newFilePath);
    await shareToInstagramStoryV2(newFilePath);
  };

  const isImageSelected = !!selectedImage?.uri;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={styles.button} onPress={onSelectImage}>
          <Text style={styles.buttonText}>Select Photo</Text>
        </TouchableOpacity>

        {isImageSelected ? (
          <TouchableOpacity style={styles.button} onPress={onSavePress}>
            <Text style={styles.buttonText}>Save and Share</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isImageSelected ? (
        <View style={styles.toolBar}>
          <TouchableOpacity
            onPress={() => canvasRef.current?.undo()}
            style={styles.functionButton}
          >
            <Text style={{ color: 'white' }}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => canvasRef.current?.clear()}
            style={styles.functionButton}
          >
            <Text style={{ color: 'white' }}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              canvasRef.current?.clear();
              setActiveStickers([]);
            }}
            style={styles.functionButton}
          >
            <Text style={{ color: 'white' }}>Reset All</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isImageSelected && (
        <ViewShot
          ref={viewShotRef}
          style={[
            styles.canvasWrapper,
            {
              width: imageDimensions.width,
            },
          ]}
        >
          <SketchCanvas
            ref={canvasRef}
            style={styles.canvas}
            strokeColor={currentColor}
            localSourceImage={{
              filename: selectedImage?.uri.replace('file://', '') as string,
              mode: 'AspectFit',
            }}
          />
          {activeStickers.map(s => (
            <Sticker
              key={s.id}
              uri={s.uri}
              initialX={s.x}
              initialY={s.y}
              onDelete={() => {
                setActiveStickers(prev =>
                  prev.filter(sticker => sticker.id !== s.id),
                );
              }}
            />
          ))}
        </ViewShot>
      )}
      {isImageSelected ? (
        <View style={styles.colorPalette}>
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setCurrentColor(color)}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: color,
                  borderWidth: currentColor === color ? 2 : 0,
                  borderColor: '#333',
                },
              ]}
            />
          ))}
        </View>
      ) : null}
      {isImageSelected && (
        <View style={styles.stickerBar}>
          {STICKER_LIBRARY.map((stickerUri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => addSticker(stickerUri)}
            >
              <Image
                source={stickerUri}
                style={{ width: 50, height: 50, margin: 8 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 12,
    backgroundColor: '#f2f2f2',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  canvasWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: 16,
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  colorPalette: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
  },
  toolBar: {
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  stickerBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: '#ff4d4d',
    width: 18,
    height: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
  },

  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserProfilePicture;

const Sticker = ({ uri, initialX, initialY, onDelete }: any) => {
  const pan = useRef(
    new Animated.ValueXY({ x: initialX, y: initialY }),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 }); // reset delta
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset(); // persist final position
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        pan.getLayout(),
        {
          position: 'absolute',
        },
      ]}
    >
      <View>
        <Image source={uri} style={{ width: 80, height: 80 }} />
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
