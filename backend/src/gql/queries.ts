import gql from "graphql-tag";

gql`
  query all {
    playerLevels {
      exp
      level
    }

    barters {
      id
      trader {
        id
      }
      level
      requiredItems {
        count
        item {
          id
          name
        }
        attributes {
          type
          name
          value
        }
      }
      rewardItems {
        count
        item {
          id
          name
        }
        attributes {
          type
          name
          value
        }
      }
    }

    traders {
      normalizedName
      id
    }

    items {
      id
      name
      shortName
      image512pxLink
      types
      width
      height
      wikiLink
      avg24hPrice
      sellFor {
        vendor {
          normalizedName
        }
        price
        priceRUB
      }
      buyFor {
        vendor {
          normalizedName
        }
        price
        priceRUB
      }
      properties {
        __typename
        ... on ItemPropertiesAmmo {
          caliber
          stackMaxSize
          tracer
          tracerColor
          ammoType
          projectileCount
          damage
          armorDamage
          fragmentationChance
          penetrationPower
          accuracyModifier
          recoilModifier
          initialSpeed
          lightBleedModifier
          heavyBleedModifier
          durabilityBurnFactor
          heatFactor
        }
        ... on ItemPropertiesArmor {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          zones
          material {
            destructibility
            name
          }
        }
        ... on ItemPropertiesArmorAttachment {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          material {
            destructibility
            name
          }
          headZones
          blindnessProtection
        }

        ... on ItemPropertiesBackpack {
          capacity
          ergoPenalty
          speedPenalty
          turnPenalty
          grids {
            width
            height
          }
        }
        ... on ItemPropertiesBarrel {
          ergonomics
          recoilModifier
          slots {
            name
          }
        }
        ... on ItemPropertiesChestRig {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          zones
          material {
            destructibility
            name
          }
          capacity
          grids {
            width
            height
          }
        }
        ... on ItemPropertiesContainer {
          capacity
          grids {
            width
            height
          }
        }
        ... on ItemPropertiesFoodDrink {
          energy
          hydration
          units
          stimEffects {
            type
            chance
            delay
            duration
            value
            percent
            skillName
          }
        }
        ... on ItemPropertiesGlasses {
          class
          durability
          blindnessProtection
          material {
            destructibility
            name
          }
        }
        ... on ItemPropertiesGrenade {
          type
          fuse
          minExplosionDistance
          maxExplosionDistance
          fragments
          contusionRadius
        }
        ... on ItemPropertiesHelmet {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          headZones
          material {
            destructibility
            name
          }
          deafening
          blocksHeadset
          slots {
            name
          }
        }
        ... on ItemPropertiesKey {
          uses
        }
        ... on ItemPropertiesMagazine {
          ergonomics
          recoilModifier
          capacity
          loadModifier
          ammoCheckModifier
          malfunctionChance
          allowedAmmo {
            properties {
              ... on ItemPropertiesAmmo {
                caliber
              }
            }
          }
        }
        ... on ItemPropertiesMedicalItem {
          uses
          useTime
          cures
        }
        ... on ItemPropertiesMelee {
          slashDamage
          stabDamage
          hitRadius
        }
        ... on ItemPropertiesMedKit {
          hitpoints
          useTime
          maxHealPerUse
          cures
          hpCostLightBleeding
          hpCostHeavyBleeding
        }
        ... on ItemPropertiesNightVision {
          intensity
          noiseIntensity
          noiseScale
          diffuseIntensity
        }
        ... on ItemPropertiesPainkiller {
          uses
          useTime
          cures
          painkillerDuration
          energyImpact
          hydrationImpact
        }
        ... on ItemPropertiesScope {
          ergonomics
          sightModes
          sightingRange
          recoilModifier
          slots {
            name
          }
          zoomLevels
        }
        ... on ItemPropertiesSurgicalKit {
          uses
          useTime
          cures
          minLimbHealth
          maxLimbHealth
        }
        ... on ItemPropertiesWeapon {
          caliber
          defaultAmmo {
            id
            shortName
          }
          effectiveDistance
          fireModes
          fireRate
          maxDurability
          defaultPreset {
            properties {
              ... on ItemPropertiesPreset {
                ergonomics
                recoilVertical
                recoilHorizontal
                moa
              }
            }
          }
        }
        ... on ItemPropertiesWeaponMod {
          ergonomics
          recoilModifier
          accuracyModifier
          slots {
            name
          }
        }
        ... on ItemPropertiesStim {
          useTime
          cures
          stimEffects {
            type
            chance
            delay
            duration
            value
            percent
            skillName
          }
        }
      }
    }

    tasks {
      id
      tarkovDataId
      name
      trader {
        id
      }
      map {
        name
      }
      experience
      wikiLink
      minPlayerLevel
      taskRequirements {
        task {
          name
        }
        status
      }
      traderLevelRequirements {
        id
        trader {
          id
        }
        level
      }
      objectives {
        __typename
        id
        type
        description
        maps {
          name
        }
        optional
        ... on TaskObjectiveItem {
          id
          item {
            id
            name
          }
          count
          foundInRaid
        }
      }
      startRewards {
        items {
          item {
            id
            name
          }
          count
        }
        offerUnlock {
          trader {
            id
          }
          level
          item {
            id
            name
          }
        }
        traderUnlock {
          id
        }
      }
      finishRewards {
        items {
          item {
            id
            name
          }
          count
        }
        offerUnlock {
          trader {
            id
          }
          level
          item {
            id
            name
          }
        }
        traderUnlock {
          id
        }
      }
    }
  }
`;

gql`
  query traderRestocks {
    traders {
      id
      resetTime
    }
  }
`;

gql`
  query serverStatus {
    status {
      currentStatuses {
        name
        statusCode
      }
      generalStatus {
        name
        message
        status
        statusCode
      }
    }
  }
`;
