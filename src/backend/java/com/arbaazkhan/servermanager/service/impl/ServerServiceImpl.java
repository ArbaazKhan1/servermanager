package com.arbaazkhan.servermanager.service.impl;

import com.arbaazkhan.servermanager.enumeration.Status;
import com.arbaazkhan.servermanager.model.Server;
import com.arbaazkhan.servermanager.repo.ServerRepo;
import com.arbaazkhan.servermanager.service.ServerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.Random;

import static java.lang.Boolean.TRUE;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j  //for console logging
public class ServerServiceImpl implements ServerService {

    //Dependency injection, via RequiredArgsConstructor
    private final ServerRepo serverRepo;

    @Override
    public Server create(Server server) {
        log.info("Saving new Server: {}", server.getName());
        server.setImgUrl(setServerImageUrl());
        return serverRepo.save(server);
    }

    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server IP: {}", ipAddress);
        Server server = serverRepo.findByIpAddress(ipAddress);
        //InetAddress is used to encapsulate IP address
        InetAddress address = InetAddress.getByName(ipAddress);
        //if we reach server within timeout set status us ServerUp else set to ServerDown
        server.setStatus(address.isReachable(10000) ? Status.SERVER_UP : Status.SERVER_DOWN);
        serverRepo.save(server);
        return server;
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Fetching all servers");
        return serverRepo.findAll(PageRequest.of(0,limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Fetching server by ID {}:", id);
        //get alows for us to return object as type server
        return serverRepo.findById(id).get();
    }

    @Override
    public Server update(Server server) {
        log.info("Updating server: {}", server.getName());
        return serverRepo.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting server: {}", id);
        serverRepo.deleteById(id);
        //We use class TRUE instead of primitive true cuz delete can return null
        return TRUE ;
    }

    //Randomly assign an image to created Servers
    private String setServerImageUrl() {
        String[] imgNames = {"server1.png", "server2.png", "server3.png", "server4.png"};
        //we return a string with the uri path being "/server/image/<imgNames index>
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/server/image/" + imgNames[new Random().nextInt(4)]).toUriString();
    }
}
