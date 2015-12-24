<?php

namespace AppBundle\DTO;

class Utils
{
    public static function getChildExpand($expand, $subset)
    {
        $childExpand = [];
        foreach ($expand as $value) {
            $prefixLength = strlen($subset) + 1;
            if (substr($value, 0, $prefixLength) == "$subset.") {
                $childExpand[] = substr($value, $prefixLength);
            }
        }
        return $childExpand;
    }
}