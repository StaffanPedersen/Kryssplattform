import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from "@expo/vector-icons/AntDesign";

interface StarRatingProps {
    rating: number;
    onRate: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => onRate(star)}
                    onPressIn={() => setHoverRating(star)}
                    onPressOut={() => setHoverRating(0)}
                >
                    <AntDesign
                        name={star <= (hoverRating || rating) ? "star" : "staro"}
                        size={24}
                        color="#FFD700"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StarRating;
