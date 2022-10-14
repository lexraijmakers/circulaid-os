import { buildSchemaSync, AuthChecker } from 'type-graphql'
import {
    ModelsEnhanceMap,
    ModelConfig,
    applyModelsEnhanceMap,
    resolvers
} from '@generated/type-graphql'
import { Authorized, Extensions } from 'type-graphql'
import { Context } from './context'

export const customAuthChecker: AuthChecker<Context> = ({ root, args, context, info }, roles) => {
    return !!context?.user?.roles?.some((r) => roles?.includes(r))
}

const repairEnhancedConfig: ModelConfig<'Repair'> = {
    fields: {
        description: [
            Authorized('ADMIN'),
            Extensions({ logMessage: 'Danger zone', logLevel: 'WARN' })
        ]
    }
}

const modelsEnhanceMap: ModelsEnhanceMap = {
    Repair: repairEnhancedConfig
}

applyModelsEnhanceMap(modelsEnhanceMap)

export const schema = buildSchemaSync({
    resolvers,
    authChecker: customAuthChecker,
    authMode: 'null'
})
