import { AntDesign, MaterialCommunityIcons, Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import React from 'react';

interface IconProps {
    iconName: string;
    iconSize: number;
    iconColor: string;
}

export const AntDesignIcon = ({ iconName, iconSize, iconColor }: IconProps) => {
    return(
        <AntDesign name={iconName} size={iconSize} color={iconColor} />
    );
};

export const Ionicon = ({ iconName, iconSize, iconColor }: IconProps) => {
    return(
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
    );
};

export const MaterialCommunityIcon = ({ iconName, iconSize, iconColor }: IconProps) => {
    return(
        <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
    );
};

export const FontAwesomeIcon = ({ iconName, iconSize, iconColor }: IconProps) => {
    return(
        <FontAwesome name={iconName} size={iconSize} color={iconColor} />
    );
};

export const EntypoIcon = ({ iconName, iconSize, iconColor }: IconProps) => {
    return(
        <Entypo name={iconName} size={iconSize} color={iconColor} />
    );
};