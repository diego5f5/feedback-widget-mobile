import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

import { api } from "../../libs/api";

import { FeedbackType } from "../Widget";
import ScreenshotButton from "../ScreenshotButton";
import Button from "../Button";

import { styles } from "./styles";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

const Form = ({ feedbackType, onFeedbackCanceled, onFeedbackSent }: Props) => {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [comment, setComment] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  const handleScreenshot = () => {
    captureScreen({
      format: "jpg",
      quality: 0.8,
    })
      .then((uri) => setScreenshot(uri))
      .catch((error) => console.log(error));
  };

  const handleScreenshotRemove = () => {
    setScreenshot(null);
  };

  const handleSendFeedback = async () => {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    let screenshotBase64 = "data:image/png;base64,";
    if (screenshot) {
      screenshotBase64 += await FileSystem.readAsStringAsync(screenshot, {
        encoding: "base64",
      });
    }

    try {
      await api.post("/feedbacks", {
        type: feedbackType,
        comment,
        screenshot: screenshotBase64,
      });

      onFeedbackSent();
    } catch (error) {
      console.log(error);
      setIsSendingFeedback(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Tell us in detail what's going on..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />

        <Button
          onPress={handleSendFeedback}
          isLoading={isSendingFeedback}
          disabled={!comment || isSendingFeedback}
        />
      </View>
    </View>
  );
};

export default Form;
