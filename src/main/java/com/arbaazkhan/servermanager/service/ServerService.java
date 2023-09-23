package com.arbaazkhan.servermanager.service;

import com.arbaazkhan.servermanager.model.Server;

import java.io.IOException;
import java.util.Collection;

public interface ServerService {
    Server create(Server server);
    Server ping(String ipAddress) throws IOException;
    Collection<Server> list(int limit);//return x amount of servers
    Server get(Long id);
    Server update(Server server);
    Boolean delete(Long id);

}
